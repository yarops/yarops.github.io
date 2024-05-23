
import useSite from 'hooks/use-site';

import styles from './SideToggler.module.scss';
import { useEffect } from 'react';

const SideToggler = () => {

  const { isNavOpen, toggleNav } = useSite()

  useEffect(() => {
    isNavOpen
      ? (document.body.style.overflow = 'hidden')
      : (document.body.style.overflow = 'auto');
  }, [isNavOpen]);
  
  return (
    <button 
      className={styles.sideToggler} 
      onClick={() => toggleNav()}
      data-active={isNavOpen}
    >
      <span className="sr-only">Toggle menu</span>
      {isNavOpen ? (
        <svg className="icon" width="24px" height="24px">
          <use href="#icon-close"></use>
        </svg>
      ) : (
        <svg className="icon" width="24px" height="24px">
          <use href="#icon-menu"></use>
        </svg>
      )}
      
    </button>
  );
};

export default SideToggler;
