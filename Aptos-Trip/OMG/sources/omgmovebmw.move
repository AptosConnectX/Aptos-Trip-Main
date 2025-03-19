module 0xb7dfd36fb874559f774ffb04b2ad84acadf1c410e9a155266fc9096d375667fc::AptosTripOMGTEST {
    use std::signer;
    use std::string::{Self, String};
    use aptos_std::table::{Self, Table};
    use aptos_framework::object::{Self, Object};
    use aptos_framework::randomness;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_token_objects::collection;
    use aptos_token_objects::token;
    use std::vector;
    use std::option;
    use aptos_framework::event;


    const E_ALREADY_MINTED: u64 = 1;
    const E_NO_NFTS_LEFT: u64 = 2;
    const E_NOT_TOKEN_OWNER: u64 = 3;
    const E_INSUFFICIENT_BALANCE: u64 = 4;
    const E_INVALID_CREATOR: u64 = 5;
    const E_ALREADY_VOTED: u64 = 6;
    const E_INVALID_CAR_INDEX: u64 = 7;
    const E_INSUFFICIENT_POINTS: u64 = 8;
    const E_NO_TICKETS_LEFT: u64 = 9;


    const TOTAL_NFTS: u64 = 56;
    const MINT_PRICE: u64 = 1000; 
    const CREATOR_ADDRESS: address = @0xb7dfd36fb874559f774ffb04b2ad84acadf1c410e9a155266fc9096d375667fc;
    const COLLECTION_NAME: vector<u8> = b"BMW Aptos Trip Collection"; 
    const COLLECTION_DESCRIPTION: vector<u8> = b"A collection of NFTs for BMW Aptos Trip participants";
    const COLLECTION_URI: vector<u8> = b"https://amaranth-raw-lemur-681.mypinata.cloud/ipfs/bafkreib4bvzizvouspxjajxrqiuvcizu7xo3xjvbrqare2rftqqntocqw4";
    const TOKEN_PREFIX: vector<u8> = b"BMWAptosTripNFT-";
    const BASE_URI: vector<u8> = b"https://amaranth-raw-lemur-681.mypinata.cloud/ipfs/bafybeifcxuin2yc4z7lgliiooepnnfvzuopgplb744psxtafy2g4cz44vi/";
    const GOLDEN_TICKET_NAME: vector<u8> = b"GoldenTicket";
    const GOLDEN_TICKET_URI: vector<u8> = b"https://amaranth-raw-lemur-681.mypinata.cloud/ipfs/bafkreietdobngocelcisewhln4tsqzwq4mfziakkj2tubuo7mlfo4g4fli";
    const POINTS_PER_TICKET: u64 = 1000;
    const TOTAL_GOLDEN_TICKETS: u64 = 100;

 
    struct MintedNFTs has key {
        minted_addresses: Table<address, bool>,
        available_nfts: vector<u64>,
        total_minted: u64,
        tokens: Table<u64, Object<token::Token>>,
    }

    struct CollectionController has key {
        extend_ref: object::ExtendRef,
        mutator_ref: collection::MutatorRef,
    }

    struct Voting has key {
        ipfs_link: String,
        car_votes: Table<u64, u64>,
        voters: Table<address, bool>,
        total_cars: u64,
    }

    struct AIAssistant has key {
        nft_id: u64,
        active: bool,
    }

    struct TripPoints has key {
        points: Table<address, u64>,
        golden_tickets: Table<address, vector<u64>>,
        available_tickets: vector<u64>,
        total_minted_tickets: u64,
    }


    #[event]
    struct VoteCast has drop, store {
        voter: address,
        car_index: u64,
    }

    #[event]
    struct PointsEarned has drop, store {
        user: address,
        points: u64,
    }

    #[event]
    struct GoldenTicketMinted has drop, store {
        user: address,
        ticket_id: u64,
    }


    fun u64_to_string(num: u64): String {
        if (num == 0) {
            return string::utf8(b"0")
        };
        let bytes = vector::empty<u8>();
        let n = num;
        while (n > 0) {
            let digit = (n % 10) as u8;
            vector::push_back(&mut bytes, 48 + digit);
            n = n / 10;
        };
        vector::reverse(&mut bytes);
        string::utf8(bytes)
    }


    public entry fun initialize(account: &signer, ipfs_link: String, total_cars: u64) {
        let signer_address = signer::address_of(account);
        assert!(signer_address == CREATOR_ADDRESS, E_INVALID_CREATOR);

        if (!exists<MintedNFTs>(signer_address)) {
            let available_nfts = vector::empty<u64>();
            let i = 1;
            while (i <= TOTAL_NFTS) {
                vector::push_back(&mut available_nfts, i);
                i = i + 1;
            };
            move_to(account, MintedNFTs {
                minted_addresses: table::new(),
                available_nfts,
                total_minted: 0,
                tokens: table::new(),
            });
        };

        let collection_address = collection::create_collection_address(&signer_address, &string::utf8(COLLECTION_NAME));
        if (!object::is_object(collection_address)) {
            let constructor_ref = collection::create_fixed_collection(
                account,
                string::utf8(COLLECTION_DESCRIPTION),
                TOTAL_NFTS,
                string::utf8(COLLECTION_NAME),
                option::none(),
                string::utf8(COLLECTION_URI)
            );
            let collection_obj = object::object_from_constructor_ref<collection::Collection>(&constructor_ref);
            let extend_ref = object::generate_extend_ref(&constructor_ref);
            let mutator_ref = collection::generate_mutator_ref(&constructor_ref);
            let transfer_ref = object::generate_transfer_ref(&constructor_ref);
            object::enable_ungated_transfer(&transfer_ref);
            let object_signer = object::generate_signer(&constructor_ref);
            move_to(&object_signer, CollectionController { extend_ref, mutator_ref });
            object::transfer(account, collection_obj, signer_address);
        };

        if (!exists<Voting>(signer_address)) {
            let car_votes = table::new();
            let voters = table::new();
            let i = 0;
            while (i < total_cars) {
                table::add(&mut car_votes, i, 0);
                i = i + 1;
            };
            move_to(account, Voting {
                ipfs_link,
                car_votes,
                voters,
                total_cars,
            });
        };

        if (!exists<TripPoints>(signer_address)) {
            let available_tickets = vector::empty<u64>();
            let i = 1;
            while (i <= TOTAL_GOLDEN_TICKETS) {
                vector::push_back(&mut available_tickets, i);
                i = i + 1;
            };
            move_to(account, TripPoints {
                points: table::new(),
                golden_tickets: table::new(),
                available_tickets,
                total_minted_tickets: 0,
            });
        };
    }


    #[randomness]
    entry fun mint_nft(minter: &signer) acquires MintedNFTs {
        let minter_address = signer::address_of(minter);
        let minted_nfts = borrow_global_mut<MintedNFTs>(CREATOR_ADDRESS);

        assert!(coin::balance<AptosCoin>(minter_address) >= MINT_PRICE, E_INSUFFICIENT_BALANCE);
        assert!(!table::contains(&minted_nfts.minted_addresses, minter_address), E_ALREADY_MINTED);
        assert!(minted_nfts.total_minted < TOTAL_NFTS, E_NO_NFTS_LEFT);

        coin::transfer<AptosCoin>(minter, CREATOR_ADDRESS, MINT_PRICE);

        let remaining_nfts = vector::length(&minted_nfts.available_nfts);
        let random_index = randomness::u64_range(0, remaining_nfts);
        let token_id = *vector::borrow(&minted_nfts.available_nfts, random_index);
        vector::remove(&mut minted_nfts.available_nfts, random_index);

        let token_name = string::utf8(TOKEN_PREFIX);
        string::append(&mut token_name, u64_to_string(token_id));
        let token_description = string::utf8(b"BMW Aptos Trip NFT");
        let token_uri = string::utf8(BASE_URI);
        string::append(&mut token_uri, u64_to_string(token_id));
        string::append(&mut token_uri, string::utf8(b".png"));

        let constructor_ref = token::create(
            minter,
            string::utf8(COLLECTION_NAME),
            token_description,
            token_name,
            option::none(),
            token_uri
        );

        let token_obj = object::object_from_constructor_ref<token::Token>(&constructor_ref);
        object::transfer(minter, token_obj, minter_address);

        table::add(&mut minted_nfts.minted_addresses, minter_address, true);
        table::add(&mut minted_nfts.tokens, token_id, token_obj);
        minted_nfts.total_minted = minted_nfts.total_minted + 1;

        move_to(minter, AIAssistant {
            nft_id: token_id,
            active: true,
        });
    }


    public entry fun vote(voter: &signer, car_index: u64) acquires Voting, MintedNFTs {
        let voter_addr = signer::address_of(voter);
        let voting = borrow_global_mut<Voting>(CREATOR_ADDRESS);
        let minted_nfts = borrow_global<MintedNFTs>(CREATOR_ADDRESS);

        let is_owner = false;
        let i = 1;
        while (i <= TOTAL_NFTS) {
            if (table::contains(&minted_nfts.tokens, i)) {
                let token_obj = table::borrow(&minted_nfts.tokens, i);
                if (object::is_owner(*token_obj, voter_addr)) {
                    is_owner = true;
                    break;
                };
            };
            i = i + 1;
        };
        assert!(is_owner, E_NOT_TOKEN_OWNER);

        assert!(car_index < voting.total_cars, E_INVALID_CAR_INDEX);
        assert!(!table::contains(&voting.voters, voter_addr), E_ALREADY_VOTED);

        let current_votes = table::borrow_mut(&mut voting.car_votes, car_index);
        *current_votes = *current_votes + 1;
        table::add(&mut voting.voters, voter_addr, true);

        event::emit(VoteCast {
            voter: voter_addr,
            car_index,
        });
    }


    public entry fun update_ipfs_link(account: &signer, new_ipfs_link: String) acquires Voting {
        let signer_address = signer::address_of(account);
        assert!(signer_address == CREATOR_ADDRESS, E_INVALID_CREATOR);
        let voting = borrow_global_mut<Voting>(CREATOR_ADDRESS);
        voting.ipfs_link = new_ipfs_link;
    }


    public entry fun earn_points(user: &signer, transaction_count: u64, staked_apt: u64) acquires TripPoints {
        let user_address = signer::address_of(user);
        let trip_points = borrow_global_mut<TripPoints>(CREATOR_ADDRESS);

        let points_from_tx = transaction_count;
        let points_from_staking = if (staked_apt < 10_000_000) { 0 }
            else if (staked_apt < 50_000_000) { 500 }
            else if (staked_apt < 100_000_000) { 1000 }
            else { 2000 };
        let total_points = points_from_tx + points_from_staking;

        if (!table::contains(&trip_points.points, user_address)) {
            table::add(&mut trip_points.points, user_address, total_points);
        } else {
            let current_points = table::borrow_mut(&mut trip_points.points, user_address);
            *current_points = *current_points + total_points;
        };

        event::emit(PointsEarned {
            user: user_address,
            points: total_points,
        });
    }


    #[randomness]
    entry fun mint_golden_ticket(user: &signer) acquires TripPoints {
        let user_address = signer::address_of(user);
        let trip_points = borrow_global_mut<TripPoints>(CREATOR_ADDRESS);

        let user_points = table::borrow_mut(&mut trip_points.points, user_address);
        assert!(*user_points >= POINTS_PER_TICKET, E_INSUFFICIENT_POINTS);
        assert!(trip_points.total_minted_tickets < TOTAL_GOLDEN_TICKETS, E_NO_TICKETS_LEFT);

        let remaining_tickets = vector::length(&trip_points.available_tickets);
        let random_index = randomness::u64_range(0, remaining_tickets);
        let ticket_id = *vector::borrow(&trip_points.available_tickets, random_index);
        vector::remove(&mut trip_points.available_tickets, random_index);

        let ticket_name = string::utf8(GOLDEN_TICKET_NAME);
        let ticket_description = string::utf8(b"Golden Ticket for BMW Aptos Trip Raffle");
        let ticket_uri = string::utf8(GOLDEN_TICKET_URI);

        let constructor_ref = token::create(
            user,
            string::utf8(COLLECTION_NAME),
            ticket_description,
            ticket_name,
            option::none(),
            ticket_uri
        );

        let token_obj = object::object_from_constructor_ref<token::Token>(&constructor_ref);
        object::transfer(user, token_obj, user_address);

        if (!table::contains(&trip_points.golden_tickets, user_address)) {
            table::add(&mut trip_points.golden_tickets, user_address, vector::empty<u64>());
        };
        let user_tickets = table::borrow_mut(&mut trip_points.golden_tickets, user_address);
        vector::push_back(user_tickets, ticket_id);

        trip_points.total_minted_tickets = trip_points.total_minted_tickets + 1;
        *user_points = *user_points - POINTS_PER_TICKET;

        event::emit(GoldenTicketMinted {
            user: user_address,
            ticket_id,
        });
    }


    #[view]
    public fun get_votes(car_index: u64): u64 acquires Voting {
        let voting = borrow_global<Voting>(CREATOR_ADDRESS);
        assert!(car_index < voting.total_cars, E_INVALID_CAR_INDEX);
        *table::borrow(&voting.car_votes, car_index)
    }

    #[view]
    public fun get_ipfs_link(): String acquires Voting {
        let voting = borrow_global<Voting>(CREATOR_ADDRESS);
        voting.ipfs_link
    }

    #[view]
    public fun has_voted(voter: address): bool acquires Voting {
        let voting = borrow_global<Voting>(CREATOR_ADDRESS);
        table::contains(&voting.voters, voter)
    }

    #[view]
    public fun get_points(user: address): u64 acquires TripPoints {
        let trip_points = borrow_global<TripPoints>(CREATOR_ADDRESS);
        if (table::contains(&trip_points.points, user)) {
            *table::borrow(&trip_points.points, user)
        } else {
            0
        }
    }

    #[view]
    public fun has_ai_assistant(user: address): bool {
        exists<AIAssistant>(user)
    }

    #[view]
    public fun get_ai_assistant(user: address): (u64, bool) acquires AIAssistant {
        let assistant = borrow_global<AIAssistant>(user);
        (assistant.nft_id, assistant.active)
    }

    #[view]
    public fun get_golden_tickets(user: address): vector<u64> acquires TripPoints {
        let trip_points = borrow_global<TripPoints>(CREATOR_ADDRESS);
        if (table::contains(&trip_points.golden_tickets, user)) {
            *table::borrow(&trip_points.golden_tickets, user)
        } else {
            vector::empty<u64>()
        }
    }
}