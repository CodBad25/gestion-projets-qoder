'use client';

import { useEffect } from 'react';

export default function ZaiButtonHider() {
  useEffect(() => {
    function hideZaiButton() {
      // Liste exhaustive de sélecteurs pour cibler le bouton Z.ai
      const selectors = [
        '[data-testid*="zai"]',
        '[class*="zai"]',
        '[id*="zai"]',
        '[data-testid*="z-ai"]',
        '[class*="z-ai"]',
        '[id*="z-ai"]',
        // Cibler les éléments en position fixe dans le coin inférieur gauche
        'div[style*="position: fixed"][style*="bottom"][style*="left"]',
        'button[style*="position: fixed"][style*="bottom"]',
        // Cibler par dimensions communes des boutons Z.ai
        '*[style*="width: 48px"][style*="height: 48px"][style*="position: fixed"]',
        '*[style*="width:48px"][style*="height:48px"][style*="position:fixed"]',
        // Cibler les boutons circulaires en bas à gauche
        '*[style*="border-radius: 50%"][style*="position: fixed"][style*="bottom"]',
        '*[style*="border-radius:50%"][style*="position:fixed"][style*="bottom"]',
        // Cibler spécifiquement les éléments avec du texte "N"
        'div[style*="position: fixed"]:has-text("N")',
        'button[style*="position: fixed"]:has-text("N")',
        // Sélecteurs plus génériques pour les éléments flottants
        '*[style*="position: fixed"][style*="z-index"][style*="bottom"][style*="left"]',
      ];
      
      let elementsFound = 0;
      
      selectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            if (el && el.textContent?.includes('N')) {
              console.log('Élément Z.ai trouvé et réduit:', el);
              const htmlEl = el as HTMLElement;
              htmlEl.style.transform = 'scale(0.01)';
              htmlEl.style.width = '1px';
              htmlEl.style.height = '1px';
              htmlEl.style.fontSize = '0.1px';
              htmlEl.style.opacity = '0.01';
              htmlEl.style.pointerEvents = 'none';
              htmlEl.style.zIndex = '-9999';
              htmlEl.style.overflow = 'hidden';
              elementsFound++;
            }
          });
        } catch (e) {
          // Ignorer les erreurs de sélecteur
        }
      });
      
      // Recherche plus agressive par contenu textuel
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (
          style.position === 'fixed' &&
          el.textContent?.trim() === 'N' &&
          (style.bottom !== 'auto' || style.left !== 'auto')
        ) {
          console.log('Bouton N trouvé par recherche textuelle:', el);
          const htmlEl = el as HTMLElement;
          htmlEl.style.transform = 'scale(0.005)';
          htmlEl.style.width = '0.5px';
          htmlEl.style.height = '0.5px';
          htmlEl.style.fontSize = '0.1px';
          htmlEl.style.opacity = '0.01';
          htmlEl.style.pointerEvents = 'none';
          htmlEl.style.zIndex = '-9999';
          htmlEl.style.overflow = 'hidden';
          elementsFound++;
        }
      });
      
      if (elementsFound > 0) {
        console.log(`${elementsFound} élément(s) Z.ai réduit(s)`);
      }
    }
    
    // Exécuter immédiatement
    hideZaiButton();
    
    // Exécuter après un délai pour s'assurer que tous les éléments sont chargés
    const timeouts = [100, 500, 1000, 2000];
    timeouts.forEach(delay => {
      setTimeout(hideZaiButton, delay);
    });
    
    // Surveiller les changements du DOM
    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false;
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldCheck = true;
        }
      });
      if (shouldCheck) {
        setTimeout(hideZaiButton, 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'id']
    });
    
    // Vérification périodique
    const interval = setInterval(hideZaiButton, 2000);
    
    return () => {
      observer.disconnect();
      clearInterval(interval);
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);
  
  return null;
}