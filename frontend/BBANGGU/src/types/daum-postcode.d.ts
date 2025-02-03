declare global {
    interface Window {
      daum: {
        Postcode: new (config: {
          oncomplete: (data: {
            address: string
            addressType: string
            bname: string
            buildingName: string
            zonecode: string
            roadAddress: string
            jibunAddress: string
          }) => void
        }) => {
          open: () => void
        }
      }
    }
  }
  
  export {}
  
  