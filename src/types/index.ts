import type { ComponentType } from "react";
import type { IconType } from "react-icons";
export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
export type TRole = "ADMIN" | "USER" | "AGENT";

export interface ISidebarItem {
  title: string;
  url: string;
  items: {
    title: string;
    url: string;
    component: ComponentType;
    icon?: IconType;
  }[];
}

export type {
  IChangePassword,
  ILogin,
  IRegister,
  IRegisterData,
  ISendOTP,
  IUpdateProfile,
  IVerifyOTP,
} from "./auth.type";
