import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import Blockies from 'react-blockies';

import ConnectDropdown from 'modules/auth/connect-dropdown';
import ChevronFlip from 'modules/common/chevron-flip';
import { formatDai } from 'utils/format-number';
import { useAppStatusStore } from 'modules/app/store/app-status';
import Styles from 'modules/auth/connect-account.styles.less';
import ToggleHeightStyles from 'utils/toggle-height.styles.less';
import { MOBILE_MENU_STATES } from 'modules/common/constants';

const ConnectAccount = () => {
  const connectAccount = useRef(null);
  const connectDropdown = useRef(null);
  const {
    loginAccount: { meta: userInfo, balances },
    isLogged,
    isMobile,
    restoredAccount,
    isConnectionTrayOpen,
    actions: { setIsConnectionTrayOpen, setMobileMenuState },
  } = useAppStatusStore();

  useEffect(() => {
    if (isMobile) {
      setMobileMenuState(isConnectionTrayOpen ? MOBILE_MENU_STATES.ACCOUNT_DROPDOWN_OPEN : MOBILE_MENU_STATES.CLOSED);
    }
  }, [isConnectionTrayOpen]);

  function toggleDropdown(cb?: Function) {
    setIsConnectionTrayOpen(!isConnectionTrayOpen);
    if (cb && typeof cb === 'function') cb();
  }

  if ((!isLogged && !restoredAccount) || !userInfo) return null;

  return (
    <div
      onClick={event => event.stopPropagation()}
      className={classNames(Styles.ConnectAccount, {
        [Styles.selected]: isConnectionTrayOpen,
      })}
      ref={connectAccount}
    >
      <div onClick={() => toggleDropdown()} role="button" tabIndex={-1}>
        <div>
          <div className={Styles.AccountInfo}>
            {userInfo.profileImage ? (
              <img src={userInfo.profileImage} />
            ) : (
              <Blockies seed={userInfo.address.toLowerCase()} />
            )}
            <div>
              <div>Account</div>
              <div>
                {userInfo.email ? userInfo.email : userInfo.accountType}
              </div>
              <span>{formatDai(balances.dai).full}</span>
            </div>
          </div>
          <span>
            <ChevronFlip
              pointDown={isConnectionTrayOpen}
              stroke="#fff"
              filledInIcon
              quick
            />
          </span>
        </div>
      </div>
      <div
        ref={connectDropdown}
        className={classNames(
          Styles.ConnectDropdown,
          ToggleHeightStyles.target,
          ToggleHeightStyles.quick,
          {
            [Styles.Open]: isConnectionTrayOpen,
            [ToggleHeightStyles.open]: isConnectionTrayOpen,
          }
        )}
      >
        <ConnectDropdown toggleDropdown={toggleDropdown} />
      </div>
    </div>
  );
};

export default ConnectAccount;
