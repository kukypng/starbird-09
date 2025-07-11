import { useState, useEffect } from 'react';

export interface IOSInfo {
  isIOS: boolean;
  isSafari: boolean;
  isIOSSafari: boolean;
  version: number | null;
  shouldUseLite: boolean;
}

const detectIOSSafari = (): IOSInfo => {
  if (typeof window === 'undefined' || !navigator) {
    return {
      isIOS: false,
      isSafari: false,
      isIOSSafari: false,
      version: null,
      shouldUseLite: false,
    };
  }

  const userAgent = navigator.userAgent;
  
  // Detectar iOS (iPhone, iPad, iPod)
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !('MSStream' in window);
  
  // Detectar especificamente iPhone (qualquer navegador)
  const isIPhone = /iPhone/.test(userAgent) && !('MSStream' in window);
  
  // Detectar Safari (não Chrome ou outros browsers)
  const isSafari = /Safari/.test(userAgent) && !/Chrome|CriOS|FxiOS|EdgiOS/.test(userAgent);
  
  // Versão do iOS
  let version: number | null = null;
  const versionMatch = userAgent.match(/OS (\d+)_/);
  if (versionMatch) {
    version = parseInt(versionMatch[1], 10);
  }

  const isIOSSafari = isIOS && isSafari;
  
  // Usar Lite se for iPhone (qualquer navegador) versão 16+ 
  const shouldUseLite = isIPhone && (version === null || version >= 16);

  return {
    isIOS,
    isSafari,
    isIOSSafari,
    version,
    shouldUseLite,
  };
};

export const useIOSDetection = (): IOSInfo => {
  const [iosInfo, setIOSInfo] = useState<IOSInfo>(() => detectIOSSafari());

  useEffect(() => {
    // Verificar localStorage para preferências de admin
    const manualLiteEnabled = localStorage.getItem('dashboard-lite-enabled') === 'true';
    const forceNormalDashboard = localStorage.getItem('force-normal-dashboard') === 'true';
    
    if (forceNormalDashboard) {
      // Admin forçou dashboard normal - desabilitar lite
      setIOSInfo(prev => ({
        ...prev,
        shouldUseLite: false,
      }));
    } else if (manualLiteEnabled) {
      // Admin habilitou Dashboard iOS manualmente (funciona para qualquer dispositivo)
      setIOSInfo(prev => ({
        ...prev,
        shouldUseLite: true,
      }));
    }
  }, []);

  return iosInfo;
};