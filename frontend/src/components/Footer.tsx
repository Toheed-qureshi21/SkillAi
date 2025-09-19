import React from "react";

const Footer = () => {
  return (
    <footer className="pt-8 mx-auto w-full pb-4">
      <p className="text-center">
        @{new Date().getFullYear()} SkillAI All rights reserved
      </p>
    </footer>
  );
};

export default Footer;
