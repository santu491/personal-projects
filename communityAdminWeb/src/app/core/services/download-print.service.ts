import { Injectable } from "@angular/core";
import html2canvas from "html2canvas";
import jspdf from "jspdf";

@Injectable({
    providedIn: 'root',
  })
  export class DownloadPrintService {
    public downloadPDF(identifier:string, fileName: string, type: boolean) {
        var data = document.getElementById(identifier); //Id of the table
        if (data) {
          html2canvas(data).then((canvas) => {
            let imgWidth = 190;
            let imgHeight = (canvas.height * imgWidth) / canvas.width;
            const contentDataURL = canvas.toDataURL("image/png");
            if (type) {
              let pdf = new jspdf("p", "mm", "a4"); // A4 size page of PDF
              let position = 10;
              pdf.addImage(
                contentDataURL,
                "PNG",
                10,
                position,
                imgWidth,
                imgHeight
              );
              pdf.save(`${fileName}.pdf`); // Generated PDF
            }
          });
        }
      }
    
      print(identifier: string, title: string, style?:string): void {
        let printContents, popupWin;
        printContents = document.getElementById(identifier);
        if (printContents) {
          printContents = printContents.innerHTML;
        }
        popupWin = window.open("", "_blank", "top=10,left=10,height=80%,width=auto");
        if (popupWin) {
          popupWin.document.open();
          popupWin.document.write(`
            <html>
              <head>
                <title>${title}</title>`);
          if(style) {
            popupWin.document.write(`<style>${style}</style>`)
          }
          popupWin.document.write(`
            </head>
            <body onload="window.print();">${printContents}</body>
          </html>
          `);
          popupWin.document.close();
        }
      }
  }