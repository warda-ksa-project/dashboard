export interface IEditImage {
  props: {
      visible: boolean;
      imgSrc: string;
  };
  onEditBtn: (e?: Event) => void;
}
