import {
  APTOS_CONNECT_ACCOUNT_URL,
  AboutAptosConnect,
  AptosPrivacyPolicy,
  WalletItem,
  groupAndSortWallets,
  isAptosConnectWallet,
  isInstallRequired,
  type AptosWallet,
  type AdapterNotDetectedWallet,
} from "@aptos-labs/wallet-adapter-react";
import { useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronDown, Copy, LogOut, User } from "lucide-react";
import { useCallback, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

// Функция для обрезки адреса
const truncateAddress = (address: unknown): string => {
  if (typeof address === "string") {
    return address.slice(0, 6) + "..." + address.slice(-6);
  }
  if (address && typeof address === "object" && "toString" in address) {
    const addressStr = address.toString();
    return addressStr.slice(0, 6) + "..." + addressStr.slice(-6);
  }
  return "";
};

export function WalletSelector() {
  const { account, connected, disconnect, wallet, wallets = [] } = useWallet();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const closeDialog = useCallback(() => setIsDialogOpen(false), []);

  const copyAddress = useCallback(async () => {
    const address = account?.address?.toString();
    if (!address) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No wallet address available to copy.",
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Success",
        description: "Copied wallet address to clipboard.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy wallet address.",
      });
    }
  }, [account, toast]);

  const { aptosConnectWallets, availableWallets, installableWallets } = groupAndSortWallets(wallets);

  return connected ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-400 focus:ring-2 focus:ring-blue-300 focus:outline-none transition duration-300">
          {account?.ansName || truncateAddress(account?.address) || "Unknown"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white p-2 rounded-lg shadow-lg">
        <DropdownMenuItem
          onSelect={copyAddress}
          className="gap-2 py-2 px-4 hover:bg-gray-200 rounded-md focus:outline-none"
        >
          <Copy className="h-4 w-4" /> Copy address
        </DropdownMenuItem>
        <div className="h-px bg-gray-200 my-2" />
        {wallet && isAptosConnectWallet(wallet) && (
          <DropdownMenuItem asChild>
            <a
              href={APTOS_CONNECT_ACCOUNT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-2 py-2 px-4 hover:bg-gray-200 rounded-md focus:outline-none"
            >
              <User className="h-4 w-4" /> Account
            </a>
          </DropdownMenuItem>
        )}
        <div className="h-px bg-gray-200 my-2" />
        <DropdownMenuItem
          onSelect={disconnect}
          className="gap-2 py-2 px-4 hover:bg-gray-200 rounded-md focus:outline-none"
        >
          <LogOut className="h-4 w-4" /> Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-400 focus:ring-2 focus:ring-blue-300 focus:outline-none transition duration-300"
          disabled={connected}
        >
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-auto bg-white p-6 rounded-lg shadow-lg">
        <AboutAptosConnect renderEducationScreen={renderEducationScreen}>
          <ConnectWalletDialog
            aptosConnectWallets={aptosConnectWallets as AptosWallet[]}
            availableWallets={availableWallets as AptosWallet[]}
            installableWallets={installableWallets as AdapterNotDetectedWallet[]}
            close={closeDialog}
          />
        </AboutAptosConnect>
      </DialogContent>
    </Dialog>
  );
}

interface ConnectWalletDialogProps {
  aptosConnectWallets: AptosWallet[];
  availableWallets: AptosWallet[];
  installableWallets: AdapterNotDetectedWallet[];
  close: () => void;
}

function ConnectWalletDialog({
  aptosConnectWallets,
  availableWallets,
  installableWallets,
  close,
}: ConnectWalletDialogProps) {
  const location = useLocation();
  const isPublicMintPage = location.pathname !== "/create-collection" && location.pathname !== "/my-collections";
  const hasAptosConnectWallets = !!aptosConnectWallets.length;

  return (
    <>
      {isPublicMintPage ? (
        <>
          <DialogHeader className="flex flex-col items-center">
            <DialogTitle className="flex flex-col text-center leading-snug">
              <span>Log in or sign up</span>
              <span>with Social + Aptos Connect</span>
            </DialogTitle>
          </DialogHeader>
          {hasAptosConnectWallets && (
            <div className="flex flex-col gap-2 pt-3">
              {aptosConnectWallets.map((wallet) => (
                <AptosConnectWalletRow key={wallet.name} wallet={wallet} onConnect={close} />
              ))}
              <p className="flex gap-1 justify-center items-center text-muted-foreground text-sm">
                Learn more about{" "}
                <AboutAptosConnect.Trigger className="flex gap-1 py-3 items-center text-foreground">
                  Aptos Connect <ArrowRight size={16} />
                </AboutAptosConnect.Trigger>
              </p>
              <AptosPrivacyPolicy className="flex flex-col items-center py-1">
                <p className="text-xs leading-5">
                  <AptosPrivacyPolicy.Disclaimer />{" "}
                  <AptosPrivacyPolicy.Link className="text-muted-foreground underline underline-offset-4" />
                  <span className="text-muted-foreground">.</span>
                </p>
                <AptosPrivacyPolicy.PoweredBy className="flex gap-1.5 items-center text-xs leading-5 text-muted-foreground" />
              </AptosPrivacyPolicy>
              <div className="flex items-center gap-3 pt-4 text-muted-foreground">
                <div className="h-px w-full bg-secondary" />
                Or
                <div className="h-px w-full bg-secondary" />
              </div>
            </div>
          )}
        </>
      ) : (
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle className="flex flex-col text-center leading-snug">
            <span>Connect a Wallet</span>
          </DialogTitle>
        </DialogHeader>
      )}
      <div className="flex flex-col gap-3 pt-3">
        {availableWallets.map((wallet) => (
          <WalletRow key={wallet.name} wallet={wallet} onConnect={close} />
        ))}
        {!!installableWallets.length && (
          <Collapsible className="flex flex-col gap-3">
            <CollapsibleTrigger asChild>
              <Button size="sm" variant="ghost" className="gap-2">
                More wallets <ChevronDown />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-3">
              {installableWallets.map((wallet) => (
                <WalletRow key={wallet.name} wallet={wallet} onConnect={close} />
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </>
  );
}

interface WalletRowProps {
  wallet: AptosWallet | AdapterNotDetectedWallet;
  onConnect?: () => void;
}

function WalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <WalletItem
      wallet={wallet}
      onConnect={onConnect}
      className="flex items-center justify-between px-4 py-3 gap-4 border rounded-md"
    >
      <div className="flex items-center gap-4">
        <WalletItem.Icon className="h-6 w-6" />
        <WalletItem.Name className="text-base font-normal" />
      </div>
      {isInstallRequired(wallet) ? (
        <Button size="sm" variant="ghost" asChild>
          <WalletItem.InstallLink />
        </Button>
      ) : (
        <WalletItem.ConnectButton asChild>
          <Button size="sm">Connect</Button>
        </WalletItem.ConnectButton>
      )}
    </WalletItem>
  );
}

function AptosConnectWalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <WalletItem wallet={wallet} onConnect={onConnect}>
      <WalletItem.ConnectButton asChild>
        <Button size="lg" variant="outline" className="w-full gap-4">
          <WalletItem.Icon className="h-5 w-5" />
          <WalletItem.Name className="text-base font-normal" />
        </Button>
      </WalletItem.ConnectButton>
    </WalletItem>
  );
}

// Обновлённый тип для AboutAptosConnectEducationScreen
interface EducationScreen {
  goBack: () => void;
  goNext: () => void;
  content: {
    title: string;
    description: string;
    image?: string; // Добавляем image, так как это поле есть в AboutAptosConnectEducationScreen
  };
}

function renderEducationScreen(screen: EducationScreen) {
  const { goBack, goNext, content } = screen;
  const { title, description, image } = content;

  return (
    <>
      <DialogHeader className="grid grid-cols-[1fr_4fr_1fr] items-center space-y-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-md"
          onClick={goBack}
        >
          <ArrowLeft />
        </Button>
        <DialogTitle className="text-center font-medium text-lg text-foreground">
          {title}
        </DialogTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-md"
          onClick={goNext}
        >
          <ArrowRight />
        </Button>
      </DialogHeader>
      <div className="py-6">
        <div className="space-y-4">
          {image && <img src={image} alt={title} className="w-full h-auto" />}
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </>
  );
}