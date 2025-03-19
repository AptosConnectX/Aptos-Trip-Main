import React from "react";
import "./TermsAndConditions.css"; // Importing styles

const TermsAndConditions = () => {
  return (
    <div className="terms-page">
      <div className="terms-container">
        <h1 className="main-heading">Aptos Trip NFT</h1> {/* Заголовок Aptos Trip NFT */}
        <h2 className="main-heading-secondary">Terms and Conditions</h2> {/* Добавлен класс для выделения "Terms and Conditions" */}
        <p><strong>Effective Date:</strong> 20.12.2024</p>
        <p><strong>Owner of the collection:</strong> Rifkat Khusnullin (Chaizy)</p>
        <p><strong>Contact:</strong> rifkat.khusnullin94@gmail.com</p>
        
        <h3>Introduction</h3>
        <p>
          Welcome to the Aptos Trip NFT collection! By purchasing or using our NFTs, as well as accessing the website resources and 
          any other existing services on the website, you agree to our Terms and Conditions outlined below. These Terms constitute a legally 
          binding agreement between you and Aptos Trip.
        </p>
        
        {/* New section "Description of Aptos Trip NFT" */}
        <h3>Description of Aptos Trip NFT</h3>
        <p>
          Each NFT includes a unique image featuring the most beautiful and best car models (according to the creator) in a pop-art comic style. 
          These images reflect the style, dynamism, and spirit of travel in the best cars.
        </p>
        <p>
          A total of 5,000 unique NFTs will be issued in the Aptos Trip series, each representing an exclusive piece of artwork.
        </p>
        
        <h3>1. Definitions</h3>
        <ul>
          <li><strong>1.1 "NFT"</strong> — a unique non-fungible token from the "Aptos Trip" collection associated with digital content.</li>
          <li><strong>1.2 "Buyer"</strong> — a person who owns an NFT from the "Aptos Trip" collection.</li>
          <li><strong>1.3 "Content"</strong> — the digital image associated with the NFT, depicting a unique car image.</li>
          <li><strong>1.4 "Limited NFT Quantity"</strong> — A total of 5,000 unique NFTs will be issued from the "Aptos Trip" collection. The number of NFTs is strictly limited, and no new tokens will be created once this limit is reached.</li>
        </ul>

        <h3>2. Rights and Restrictions</h3>
        <ul>
          <li><strong>2.1 Personal rights:</strong> The Buyer is granted the right to use the NFT content for personal purposes.</li>
          <li><strong>2.2 Commercial use:</strong> Commercial use is prohibited without the written consent of the collection owner.</li>
          <li><strong>2.3 Prohibited use:</strong> The NFT cannot be used in projects that harm the reputation of "Aptos Trip".</li>
        </ul>

        <h3>3. Royalties and Resale</h3>
        <p>A royalty of 5% is charged on the resale of NFTs on Wapal.io and goes towards the development of the project.</p>

        <h3>4. Privileges for NFT Holders</h3>
        <ul>
          <li>Share of the profit from YouTube advertising depending on the rarity level of the NFT.</li>
          <li>Access to exclusive events and giveaways.</li>
          <li>Voting rights in the Aptos Trip project.</li>
        </ul>

        <h3>5. Limitations of Liability</h3>
        <p>The collection owner is not responsible for technical failures or losses related to NFTs.</p>

        <h3>6. General Provisions</h3>
        <ul>
          <li><strong>6.1:</strong> This agreement is governed by the laws of England and Wales.</li>
          <li><strong>6.2:</strong> This agreement may be modified or supplemented as the Aptos Trip project develops. However, any changes will not affect the rights of NFT holders to receive advertising revenue from YouTube as defined in this agreement. NFT holders are required to independently track the relevance of this agreement.</li>
        </ul>
      </div>
    </div>
  );
};

export default TermsAndConditions;
