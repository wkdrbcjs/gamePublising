export interface IUser {
    user_serial_num: number | null;
    user_email: string;
    user_nick: string;
    user_auth_id: string;
    user_point: number;
    user_prof_img: string;
    is_email_rcv: number;
    create_at: string;
    update_at: string;
}

export interface IRes {
  rst_val: number;
  op: string;
  func_name: string;
}

export interface ISignRes{
  user: any;
  session: any;
}

export interface IServerRes{
  data: any;
  error: any;
}