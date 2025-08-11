import { Github, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-red-500 text-white p-6 shadow-lg">
      <div className="max-w-6xl mx-auto ">
        <p className="flex justify-center items-center gap-2.5 ">
          Created by <Heart /> See more in my{" "}
          <a href="https://github.com/homayunmmdy" title="github">
            <Github />
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
