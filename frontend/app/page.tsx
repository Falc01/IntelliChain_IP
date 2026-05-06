import { Navbar } from "./components/Navbar";
import { IPForm } from "./components/IPForm";
import { ShieldCheck, Zap, Globe } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white">
            Proteja sua <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">Genialidade</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            O primeiro sistema de registro de IP na Solana com validação por IA. 
            Seguro, imutável e inteligente.
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 pt-10 text-gray-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500/50" />
              <span className="text-sm">Registro Imutável</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500/50" />
              <span className="text-sm">Velocidade Solana</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500/50" />
              <span className="text-sm">Alcance Global</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="px-4 pb-20 flex-1">
        <IPForm />
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 text-center text-sm text-gray-600">
        <p>&copy; 2026 IntelliChain IP. Powered by SuperteamBR.</p>
      </footer>
    </main>
  );
}
