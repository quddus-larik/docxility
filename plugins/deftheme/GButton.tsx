import { FC } from "react";

interface ButtonProps {
  label?: string;
}

export const GButton: FC<ButtonProps> = ({ label = "Click" }) => (
  <button className="p-4 bg-green-500 cursor-pointer">{label}</button>
);