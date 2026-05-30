import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import "./index.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WalletModal } from "@/components/wallet-modal";
import HomeRoute from "@/routes/home";
import FactoryRoute from "@/routes/factory";
import LeaderboardRoute from "@/routes/leaderboard";
import PrestigeRoute from "@/routes/prestige";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <BrowserRouter>
        <div className="flex min-h-dvh flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomeRoute />} />
              <Route path="/factory" element={<FactoryRoute />} />
              <Route path="/leaderboard" element={<LeaderboardRoute />} />
              <Route path="/prestige" element={<PrestigeRoute />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <WalletModal />
        <Toaster
          theme="dark"
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast: "!bg-card/95 !border-white/[0.08] !backdrop-blur-xl",
              title: "!font-medium !tracking-tight",
              description: "!text-muted-foreground !text-[12px]",
              actionButton: "!bg-mac-blue !text-white",
            },
          }}
        />
      </BrowserRouter>
    </Providers>
  </StrictMode>,
);
