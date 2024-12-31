'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ScrollFrameAnimation from "@/components/frameScroll";

export default function PetalLighting() {

  return (
    <div>
      <header className="mt-4">
        <div className="flex flex-row items-center pl-2">
          <Image 
            src="/Icon-Recovered-02-01.svg" 
            alt="PETAL logo"
            width={100}
            height={100}
            priority
          />
          <h1 className="ml-2 text-8xl font-bold" style={{
            WebkitTextStroke: '1px white',
            color: 'transparent'
          }}>PETAL</h1>
        </div>
      </header>

      <main>
        <div className="bg-[#1a1a2e]">
          <Tabs defaultValue="brief" className="mt-2">
            <TabsList className="h-auto bg-transparent gap-2 p-0">
              {["Brief", "Resources", "Kits", "Show-ready"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab.toLowerCase()}
                  className="px-6 py-2 rounded-none data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-none text-white hover:text-white/90 transition-colors"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="brief" className="mt-6">
              <div>
                <Image src="/PETAL-diagram.svg" alt="PETAL diagram" width={1000} height={1000} />
                <div className="flex flex-row text-white space-x-4">
                  <p className="text-4xl font-bold">Designed <br /> with <br /> Intention</p>
                  <p className="text-xl">The PETAL modular lighting system is designed with a strict commitment to accessibility and compatibility. Every component of the system can be fabricated completely from scratch with the CAD files available for free on our website. Running on versatile, industry standard W-LED, Art-NET, and sACN data protocols, the PETAL system can be integrated into almost any existing lighting rig and applied to nearly any creative project.</p>
                </div>
                <ScrollFrameAnimation totalFrames={121} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}