"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Users, Target, Award, Heart } from 'lucide-react';
import MainLayout from '@/components/layout/main-layout';

export default function SobreNosotros() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <motion.div 
          className="relative h-[40vh] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          <motion.div 
            className="relative z-10 text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Sobre Nosotros
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Innovando el futuro del turismo con tecnología y pasión
            </p>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Historia Section */}
            <motion.div 
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-200/50 shadow-lg"
              variants={fadeInUp}
            >
              <div className="flex items-center mb-6">
                <Sparkles className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">
                  Nuestra Historia
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Somos una empresa comprometida con la excelencia y la innovación. Desde nuestros inicios,
                nos hemos dedicado a proporcionar soluciones de alta calidad para nuestros clientes,
                combinando tecnología de vanguardia con un servicio excepcional.
              </p>
            </motion.div>

            {/* Misión Section */}
            <motion.div 
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-200/50 shadow-lg"
              variants={fadeInUp}
            >
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-indigo-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">
                  Nuestra Misión
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Nuestra misión es ofrecer productos y servicios excepcionales que superen las expectativas
                de nuestros clientes, manteniendo los más altos estándares de calidad y servicio,
                mientras impulsamos la innovación en el sector turístico.
              </p>
            </motion.div>

            {/* Valores Section */}
            <motion.div 
              className="md:col-span-2 bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-200/50 shadow-lg"
              variants={fadeInUp}
            >
              <div className="flex items-center mb-6">
                <Award className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">
                  Nuestros Valores
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                  className="p-6 bg-white rounded-xl border border-gray-200 shadow-md"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Users className="h-8 w-8 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Excelencia</h3>
                  <p className="text-gray-600">Compromiso con la calidad en cada detalle</p>
                </motion.div>
                <motion.div 
                  className="p-6 bg-white rounded-xl border border-gray-200 shadow-md"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Sparkles className="h-8 w-8 text-indigo-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Innovación</h3>
                  <p className="text-gray-600">Búsqueda constante de nuevas soluciones</p>
                </motion.div>
                <motion.div 
                  className="p-6 bg-white rounded-xl border border-gray-200 shadow-md"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Heart className="h-8 w-8 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Pasión</h3>
                  <p className="text-gray-600">Amor por lo que hacemos y por nuestros clientes</p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
} 