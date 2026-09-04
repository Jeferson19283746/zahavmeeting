"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
  return <main className="grid min-h-screen place-items-center px-4 py-10">
    <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-[#091524] shadow-2xl lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative min-h-[520px] overflow-hidden p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(49,134,255,.24),transparent_35%),linear-gradient(160deg,#0b1b31,#07111e)]"/>
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 font-black">Z</div><div><div className="font-black">Zahav Meeting OS</div><div className="text-xs muted">Inteligência comercial operacional</div></div></div>
          <div className="my-auto py-12"><div className="kicker">Da conversa à execução</div><h1 className="mt-3 max-w-xl text-4xl font-black tracking-tight md:text-5xl">Reuniões que viram decisões. Decisões que viram implantação.</h1><p className="mt-5 max-w-xl leading-7 muted">Capture áudio e texto, organize a verdade da reunião, construa o fechamento com contexto e transforme a proposta aprovada em um plano executável.</p></div>
          <div className="flex flex-wrap gap-2"><span className="pill"><Sparkles size={14}/> Copiloto IA</span><span className="pill"><ShieldCheck size={14}/> Multiempresa</span></div>
        </div>
      </section>
      <section className="flex items-center p-8 md:p-12"><div className="w-full"><div className="kicker">Acesso</div><h2 className="mt-2 text-3xl font-black">Entrar no workspace</h2><p className="mt-2 text-sm muted">Tela pronta para conectar Supabase Auth. Neste MVP, o acesso demo abre o workspace Zahav.</p><label className="mt-7 block"><span className="text-xs font-semibold muted">E-mail</span><input className="mt-2" type="email" defaultValue="admin@zahavdigital.com.br"/></label><label className="mt-4 block"><span className="text-xs font-semibold muted">Senha</span><input className="mt-2" type="password" defaultValue="zahav-demo"/></label><Link href="/" className="btn btn-primary mt-6 flex w-full items-center justify-center gap-2">Entrar no modo demonstração <ArrowRight size={16}/></Link><p className="mt-4 text-center text-xs muted">Autenticação real será ativada ao informar as credenciais do projeto Supabase.</p></div></section>
    </div>
  </main>;
}
