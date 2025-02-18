interface PostcodeData {
  roadAddress: string;
  bname: string;
  buildingName: string;
  apartment: string;
}

interface Window {
  daum: {
    Postcode: new (options: { oncomplete: (data: PostcodeData) => void }) => { open: () => void };
  };
} 