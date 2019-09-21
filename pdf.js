const Printer = require('pdfmake')
const axios = require('axios')
const path = require('path')

module.exports.pdf = (req, res, next) => {
    
    const imageURL = ['https://mytest-files.sfo2.digitaloceanspaces.com/image1566552187709.svg',
                    'https://mytest-files.sfo2.digitaloceanspaces.com/image1566544006040.svg'];
    
    const contentObj = [];
  
    const generatePDF = async (imageURL) => {

        await Promise.all(imageURL.map(async url => {
            try {
                var result = await axios.get(url, {
                    responseType: 'arraybuffer'
                })
            } catch(err) {
                return next(err.message)
            }

            let image = new Buffer.from(result.data, 'base64');
            contentObj.push({
                'image': image,
                'width': 595, 
            });

        }));

        const printer = new Printer({
            Roboto: {
                normal: path.resolve('src', 'fonts', 'Roboto.ttf'),
                bold: path.resolve('src', 'fonts', 'Roboto-Bold.ttf'),
            }
        })
        
        var doc = printer.createPdfKitDocument({
            info: {
                title: 'PDF with External Image',
                author: 'Roshan Patil',
                subject: 'PDF with External Image',
            },
            footer: function(currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
            header: function(currentPage, pageCount, pageSize) {
                return [
                        { text: 'Images', alignment: 'center' },
                        { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
                    ];
            },
            
            content: contentObj,
            pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
                return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
             },
            defaultStyle: {
                fontSize: 11,
                font: 'Roboto', // The font name was defined above.
                lineHeight: 1.2,
            }
        })
        
        doc.end()
      
        res.setHeader('Content-type', 'application/pdf')
        res.setHeader('Content-disposition', 'inline; filename="Example.pdf"')
      
        doc.pipe(res);
        console.log('Done')
    }

    generatePDF(imageURL);
    
}