import styles from './Logo.module.scss';
import Image from 'next/image';
import logo from "./logo.svg";

const Logo = ({ ...rest }) => {
  return (
    <div {...rest} className={styles.logo}>
      <Image
        priority
        src={logo}
        alt="Follow us on Twitter"
      />
    </div>
  );
};

export default Logo;
