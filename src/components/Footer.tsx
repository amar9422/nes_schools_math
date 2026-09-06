import React from 'react';
import { Swords, Heart, Shield, School } from 'lucide-react';
import { GameId } from '../types';

interface FooterProps {
  onSelectGame: (game: GameId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectGame }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 mt-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                <Swords className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="text-xl font-black text-white font-['Outfit']">Math<span className="text-amber-400">Tug</span></span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Engaging, free multiplayer math games for students, teachers, and classrooms worldwide.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
              <Shield className="w-3.5 h-3.5" />
              <span>100% Free • No Ads • No Logins Required</span>
            </div>
          </div>

          {/* Games Directory */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-3">Math Games</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onSelectGame('tug-of-war')} 
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Math Tug of War (Flagship)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectGame('arrow-puzzle')} 
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Arrow Maze Logic Puzzle
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectGame('balance-scale')} 
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Balance Scale Algebraic Math
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectGame('classroom-mode')} 
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Classroom Projector Championship
                </button>
              </li>
            </ul>
          </div>

          {/* Grade Levels */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-3">Grade Tiers</h4>
            <ul className="space-y-2">
              <li className="hover:text-slate-200">Nursery (Object Counting, Ages 4-5)</li>
              <li className="hover:text-slate-200">Primary (Grades 1-2 Addition & Subtraction)</li>
              <li className="hover:text-slate-200">Middle School (Grades 3-5 Multiplication & Division)</li>
              <li className="hover:text-slate-200">High School (Grades 6-8 Algebra & Integers)</li>
              <li className="hover:text-slate-200">Gamer Mode (Rapid Mental Agility)</li>
            </ul>
          </div>

          {/* Classrooms & Teachers */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-3">For Teachers</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onSelectGame('curriculum')} 
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Curriculum & Educational Standards
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectGame('classroom-mode')} 
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1"
                >
                  <School className="w-3.5 h-3.5 text-blue-400" />
                  <span>Interactive Smartboard Guide</span>
                </button>
              </li>
              <li className="text-slate-500">Dual-Keyboard Input Protocol</li>
              <li className="text-slate-500">1.5-Second Cooldown Research</li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} MathTug. Built with passion for stress-free math education.
          </div>
          <div className="flex items-center gap-1">
            <span>Designed for classrooms everywhere</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 inline mx-0.5" />
          </div>
        </div>
      </div>
    </footer>
  );
};
