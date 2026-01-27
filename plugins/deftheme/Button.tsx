import { FC } from "react";

interface ButtonProps {
  label?: string;
}

export const MyButton: FC<ButtonProps> = ({ label = "Click" }) => (
  <button className="p-4 bg-black cursor-pointer">{label}</button>
);