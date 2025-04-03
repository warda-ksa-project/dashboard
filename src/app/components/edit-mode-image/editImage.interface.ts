export interface IEditImage {
  props: {
      visible: boolean;
      imgSrc: any;
  };
  onEditBtn: (e?: Event) => void;
}
