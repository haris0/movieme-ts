import {
  useSwitchTheme,
  useTheme,
} from 'context/ThemeContext';
import Image from 'next/image';
import Switch from 'react-switch';
import light from 'public/light.svg';
import dark from 'public/dark.svg';
import styles from './Switcher.module.scss';

const SwitcherTheme = () => {
  const switchTheme = useSwitchTheme();
  const theme = useTheme();

  return (
    <Switch
      className={styles.swicher}
      onChange={() => switchTheme()}
      checked={theme === 'dark'}
      offColor="#38c0fc"
      onColor="#888"
      checkedIcon={(
        <div className={styles.swicher_icon}>
          <Image
            src={light}
            height={19}
            width={19}
          />
        </div>
      )}
      uncheckedIcon={(
        <div className={styles.swicher_icon}>
          <Image
            src={dark}
            height={16}
            width={16}
          />
        </div>
      )}
    />
  );
};

export default SwitcherTheme;
