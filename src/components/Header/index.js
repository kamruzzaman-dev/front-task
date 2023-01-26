import React, { useEffect, useRef, useState } from "react";
import { RiBarChartHorizontalLine } from "react-icons/ri";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FiSun } from "react-icons/fi";
import { MdOutlineDarkMode } from "react-icons/md";
import avatar from "../../assets/avatar.png";
import logoDark from "../../assets/logo.png";
import logoLight from "../../assets/logo.png";
import Popover from "../Popover";
import AvatarDropdownMenu from "./avatarDropdownMenu";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useClickOutside } from "../../hooks/useClickOutside";
import {
  getLocalStorage,
  removeLocalStorage,
} from "../../utils/function/localStorage";
import { useGetLoginUserQuery } from "../../Services/userApi";
import { useNavigate } from "react-router-dom";
const Header = ({ show, setShow }) => {
  const navigate = useNavigate();
  // avater clckable menu
  const profileRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(false);
  useClickOutside(profileRef, () => setOpenMenu(false));
  // mobile show menu
  const [showMenu, setShowMenu] = useState(false);
  getLocalStorage("dark-mode");
  const [value, setValue] = useLocalStorage("dark-mode", "light");
  const handleThemeMode = () => {
    if (value === "dark") {
      setValue("light");
    } else {
      setValue("dark");
    }
  };

  useEffect(() => {
    if (value === "dark") {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    }
  }, [value]);
  // handle logout
  const handleLogout = () => {
    navigate("/");
    removeLocalStorage("testingToken");
    window.location.reload();
  };
  // get user
  const { data } = useGetLoginUserQuery();
  return (
    <div className="rf_header_wrapper">
      <div className="container">
        <div className="rf_header_container">
          <div className="rf_hamburger">
            {value === "dark" ? (
              <img src={logoDark} width="100%" className="rf_loog" alt="logo" />
            ) : (
              <img
                src={logoLight}
                width="100%"
                className="rf_loog"
                alt="logo"
              />
            )}

            <RiBarChartHorizontalLine
              className="hamburger_icon"
              onClick={() => setShow(!show)}
            />
          </div>
          <div className="verticalDots">
            <button type="button" onClick={() => setShowMenu(!showMenu)}>
              <BiDotsVerticalRounded />
            </button>
          </div>
          <div className={`rf_header_menu ${showMenu ? "active_show" : ""}`}>
            <ul className="rf_header_menu_lists">
              <li className="rf_header_menu_list">
                <div className="msg_icon theme_icon" id="theme_icon">
                  <button onClick={handleThemeMode} id="theme_icon">
                    {value === "dark" ? <FiSun /> : <MdOutlineDarkMode />}
                  </button>
                </div>
              </li>
              <li ref={profileRef} className="rf_header_menu_list">
                <img
                  src={data?.data?.avatar ? data?.data?.avatar : avatar}
                  alt="user_pic"
                  onClick={() => setOpenMenu(!openMenu)}
                />
                <Popover openPopover={openMenu} className="clickable_submenu">
                  <AvatarDropdownMenu
                    setOpenMenu={setOpenMenu}
                    logout={handleLogout}
                    data={data?.data}
                  />
                </Popover>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
