const sql = require('mssql');
const fs = require(`fs`);
const router = require('express').Router();
const {promisify} = require(`util`);
const session     =   require('express-session');
//const path = require(`path`);
//const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const readfile = promisify(fs.readFile);
const bodyParser = require('body-parser');

router.use(bodyParser());
const config = {
  user: 'sa',
  password: '1',
  server: '192.168.1.14', // You can use 'localhost\\instance' to connect to named instance
  database: 'ScanDocs',
  port: 1111,
};
//const archivecode=1;
//let rootfolder = `L:/Arhive/Scans/Documents/CIAM/01-0002-0003-000013/`;
//let rootfolder = `L:/Arhive/Scans/Documents/CIAM/01-0179-0020-01934а/`;
//let rootfolder = `Z:/01-0002-0003-000013/`;
// let rootfolder = `\\\\192.168.1.12\\media\\01-0002-0003-000013\\`;
let rootfolder = `\\\\192.168.1.12\\media\\`;
//router.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

router.get('/get-img', async (req, res) => {
    try {
       //console.log('test');
    //fs.readFile(`${__filename}`, (err,data) => {
        const FolderName = req.query.FolderName;
        const filename = req.query.fileName;
        fs.readFile(`${rootfolder+FolderName+"\\"+filename}`, (err,data) => {
        if (err) {
            return console.error(err.massage);
        }
        //console.log(data.toString(`utf-8`));
        //res.setHeader(`content-type`, `text/plain`);
        res.setHeader(`content-type`, `image/jpg`);
        res.send(data);
    });
      
    } 
    catch (error) {
      console.log(error);
    }
    
  });

  router.get('/get-files', async (req, res) => {
    try {
      // sess=req.session;
      // rootfolder = sess.rootfolder;
      // console.log(rootfolder);
           
            const FolderName = req.query.FolderName;
            //console.log(req.query.FolderName);
            const files = await readdir(rootfolder+FolderName);
            res.setHeader(`content-type`, `text/plain`);
            //const content = printDirecory(path, files);
            //res.setHeader(`content-length`, Buffer.byteLength(content));
            //res.end(files);
            //console.log(files);
            res.send(files);
             } 
    catch (error) {
      console.log(error);
    }
    
  });

  router.get('/get-fonds', async (req, res) => {
    try {
        //const path1 = `L:/Arhive/Scans/Documents/CIAM/01-0002-0003-000013/`;
        const archivecode = req.query.archivecode;
        const fond = req.query.fond;
        const fondname = req.query.fondname;
        //console.log(archivecode+fond+fondname);

        let result;
        await sql.connect(config);
        result1 = await sql.query(`SELECT RootFolder from RootFolders where 
        ArhivCode=${archivecode} and Servername = '${process.env.DB_HOST}'`);
        let rootfolder = result1.recordset[0].RootFolder;
        //console.log(rootfolder);
        // let sess=req.session;
        
        // sess.rootfolder=rootfolder;
        if (fond !== '') {
          result = await sql.query(`SELECT distinct sd.FondNum ,f.FondName, f.bYear, 
          f.fYear from sprFonds f, ScanDocsInfo sd where sd.FondNum =f.FondNum and 
          sd.ArhivCode =f.ArhivCode and sd.ArhivCode=${archivecode} and f.FondNum=${fond} order by FondNum`);
        } 

        else if (fondname !== '') {
          result = await sql.query(`SELECT distinct sd.FondNum ,f.FondName, f.bYear, f.fYear from
          sprFonds f, ScanDocsInfo sd 
          where sd.FondNum =f.FondNum and sd.ArhivCode =f.ArhivCode and sd.ArhivCode=${archivecode} 
          and f.FondName like'%${fondname}%' order by FondNum`);
        }
        else {
          result = await sql.query(`SELECT distinct sd.FondNum ,f.FondName, f.bYear, f.fYear from 
          sprFonds f, ScanDocsInfo sd where sd.FondNum =f.FondNum and sd.ArhivCode =f.ArhivCode 
          and sd.ArhivCode=${archivecode} order by FondNum`);
        }
      
        res.setHeader(`content-type`, `text/plain`);
            
        sql.close();
          
        res.send(result);
           
        
      
    } 
    catch (error) {
      console.log(error);
    }
    
  }); 

  router.get('/get-opises', async (req, res) => {
    try {
        //const path1 = `L:/Arhive/Scans/Documents/CIAM/01-0002-0003-000013/`;
        // const test1 = req.params.fond;
        // console.log(test1);
        const archivecode = req.query.archivecode;
        const opisNum = req.query.opisNum;
        const fond = req.query.fond;
        //console.log(archivecode+fond+fondname);
        let result;
        await sql.connect(config);
        if (opisNum !== '') {
          result = await sql.query(`SELECT SD.OpisNum, DeloNum, TotPages, DeloLitera, DeloName, SO.bYear,
           SO.fYear, SD.FolderName
            FROM ScanDocsInfo SD,sprOpises SO WHERE SD.ArhivCode=${archivecode} AND SD.FondNum= ${fond} 
            and SO.FondNum = ${fond} and SD.OpisNum = SO.OpisNum and SD.OpisNum = ${opisNum}
            ORDER BY SD.OpisNum,DeloNum`);		 
        }  
  
      else {
        result = await sql.query(`SELECT SD.OpisNum, DeloNum, TotPages, DeloLitera, DeloName, 
        SO.bYear, SO.fYear, SD.FolderName
           FROM ScanDocsInfo SD,sprOpises SO WHERE SD.ArhivCode=${archivecode} AND SD.FondNum= ${fond} 
           and SO.FondNum = ${fond} and SD.OpisNum = SO.OpisNum
           ORDER BY SD.OpisNum,DeloNum`);		 
      }
      
        res.setHeader(`content-type`, `text/plain`);
            
        sql.close();
          
        res.send(result);
        
    } 
    catch (error) {
      console.log(error);
    }
    
  }); 

  router.get('/get-annot', async (req, res) => {
    try {
        //const path1 = `L:/Arhive/Scans/Documents/CIAM/01-0002-0003-000013/`;
        const archivecode = req.query.archivecode;
        //const opisNum = req.query.opisNum;
        const fond = req.query.fond;
        //console.log(archivecode+fond+fondname);
        let result;
        await sql.connect(config);
        result = await sql.query(`SELECT Annotation from sprFonds where ArhivCode=${archivecode} 
        and FondNum = ${fond}`);
        //console.log(result);
        res.setHeader(`content-type`, `text/plain`);
        sql.close();
        res.send(result);
    } 
    catch (error) {
      console.log(error);
    }
  });

  router.post('/login', async (req, res) => {
    try {
        const body = req.body;
        const archivecode = req.query.archivecode;
        let login = body.login;
        let pass = body.pass;
        let result;
        await sql.connect(config);
        result = await sql.query(`SELECT CA.Id FROM ClientAccess CA INNER JOIN 
        ClientDailyPassword CP ON CA.Id = CP.ClientId
        WHERE CP.[Date] = CONVERT(date, getdate()) AND CA.[Login]= '${login}' AND CP.[Password]= '${pass}'​`);
        //console.log(result);
        if (result.rowsAffected[0]!==0) {
            const caid = result.recordset[0].Id;
            //console.log(caid);
            let result1;
            result1 = await sql.query(`SELECT ScanDocId​ from ClientAccessScanDoc where [Date] = 
            CONVERT(date, getdate()) AND ClientId = ${caid}`);
            //console.log(result1);
            let sdid1=``;
            for (let i=0; i < result1.rowsAffected[0]; i++){
                  if (i==0) {
                   //console.log(result1.recordset[i].ScanDocId );
                   sdid1 = result1.recordset[i].ScanDocId;
                  }
                 else {
                  sdid1 = sdid1 + `,` + result1.recordset[i].ScanDocId;
                  //console.log(result1.recordset[i].ScanDocId );
                  }
                  
             };
            //console.log(sdid1 );
            res.setHeader(`content-type`, `text/plain`);
            res.send(sdid1);
            sql.close();
        }
        else {
          res.send(`0`);
          
          sql.close();
          return;
        }
        //console.log(caid);
        //res.setHeader(`content-type`, `text/plain`);
        sql.close();

    } 
    catch (error) {
      console.log(error);
    }
  }); 

  router.post('/get-fonds1', async (req, res) => {
    try {
        //const path1 = `L:/Arhive/Scans/Documents/CIAM/01-0002-0003-000013/`;
        const archivecode = req.body.archivecode;
        const fond = req.body.fond;
        const fondname = req.body.fondname;
       
       // console.log(archivecode+fond+fondname);

        let result;
        await sql.connect(config);
        result1 = await sql.query(`SELECT RootFolder from RootFolders where 
        ArhivCode=${archivecode} and Servername = '${process.env.DB_HOST}'`);
        let rootfolder = result1.recordset[0].RootFolder;
        //console.log(rootfolder);
        // let sess=req.session;
        
        // sess.rootfolder=rootfolder;
        if (fond !== '') {
          result = await sql.query(`SELECT distinct sd.FondNum ,f.FondName, f.bYear, 
          f.fYear from sprFonds f, ScanDocsInfo sd where sd.FondNum =f.FondNum and 
          sd.ArhivCode =f.ArhivCode and sd.ArhivCode=${archivecode} and f.FondNum=${fond} order by FondNum`);
        } 

        else if (fondname !== '') {
          result = await sql.query(`SELECT distinct sd.FondNum ,f.FondName, f.bYear, f.fYear from
          sprFonds f, ScanDocsInfo sd 
          where sd.FondNum =f.FondNum and sd.ArhivCode =f.ArhivCode and sd.ArhivCode=${archivecode} 
          and f.FondName like'%${fondname}%' order by FondNum`);
        }
        else {
          result = await sql.query(`SELECT distinct sd.FondNum ,f.FondName, f.bYear, f.fYear from 
          sprFonds f, ScanDocsInfo sd where sd.FondNum =f.FondNum and sd.ArhivCode =f.ArhivCode 
          and sd.ArhivCode=${archivecode} order by FondNum`);
        }
      
        res.setHeader(`content-type`, `text/plain`);
            
        sql.close();
          
        res.send(result);
         
    } 
    catch (error) {
      console.log(error);
    }
    
  }); 

  router.get('/get-orderdocs', async (req, res) => {
    try {
        //const path1 = `L:/Arhive/Scans/Documents/CIAM/01-0002-0003-000013/`;
        const scandocsid = req.query.scandocsid;
        //const opisNum = req.query.opisNum;
        //const fond = req.query.fond;
       // console.log(scandocsid);

        let result;
        await sql.connect(config);
        result = await sql.query(`SELECT FondNum, OpisNum, DeloNum, DeloLitera, TotPages, DeloName, FolderName
           FROM ScanDocsInfo WHERE ScanDocId IN (${scandocsid}) ORDER BY FondNum,OpisNum,DeloNum`);
        console.log(result);
        res.setHeader(`content-type`, `text/plain`);
        sql.close();
        res.send(result);
    } 
    catch (error) {
      console.log(error);
    }
  });

  router.post('/post-search', async (req, res) => {
    try {
        
        const archivecode = req.body.archivecode;
        const SearchStr = req.body.SearchStr;
        const chFondName = req.body.chFondName;
        const chAnnotFond = req.body.chAnnotFond;
        const chcbOpisName = req.body.chcbOpisName;
        const chcbAnnotOpis = req.body.chcbAnnotOpis;
        const chcbDeloName = req.body.chcbDeloName;
        
       console.log(archivecode+`-`+SearchStr+`-`+chFondName+`-`+chAnnotFond+`-`+chcbOpisName+`-`+chcbAnnotOpis+`-`+chcbDeloName);

        let result;
        let SqlQueries= [];

        await sql.connect(config);
        if (chFondName==`true`) {
          SqlQuery1 = `SELECT FondNum, NULL OpisNum, NULL DeloNum, 1 Ps FROM sprFonds 
          WHERE FondName Like '%${SearchStr}%' and ArhivCode=${archivecode}`;
         // result = await sql.query(SqlQuery1);
        // let rootfolder = result1.recordset[0].RootFolder;
        //console.log(result.recordset.FondNum);
         SqlQueries.push(SqlQuery1);
        }
        if (chAnnotFond == `true`) {
          SqlQuery2 = `SELECT FondNum,NULL OpisNum, NULL DeloNum, 2 Ps FROM sprFonds WHERE 
          Annotation Like '%${SearchStr}%' and ArhivCode=${archivecode}`;
          SqlQueries.push(SqlQuery2);         
        }
        if (chcbOpisName == `true`) {
          SqlQuery3 = `SELECT FondNum, OpisNum, NULL DeloNum, 3 Ps FROM sprOpises WHERE 
          OpisName Like '%${SearchStr}%' and ArhivCode=${archivecode}`;
          SqlQueries.push(SqlQuery3);         
        }
        if (chcbAnnotOpis == `true`) {
          SqlQuery4 = `SELECT FondNum, OpisNum, NULL DeloNum, 4 Ps FROM sprOpises WHERE 
          Annotation Like '%${SearchStr}%' and ArhivCode=${archivecode}`;
          SqlQueries.push(SqlQuery4);         
        }
        if (chcbDeloName == `true`) {
          SqlQuery5 = `SELECT FondNum, OpisNum, DeloNum, 5 Ps FROM DeloHeaders WHERE 
          DeloHeader Like '%${SearchStr}%' and ArhivCode=${archivecode}`;
          SqlQueries.push(SqlQuery5);         
        }
        //console.log(SqlQueries[0]+SqlQueries[1]);

        let SqlQuery=``;
        for (let i=0; i < SqlQueries.length; i++) {
            if (i > 0) {
              SqlQuery = SqlQuery + ` UNION ` + SqlQueries[i];
            }
            else {
              SqlQuery = SqlQueries[i];
            }
        };
        SqlQuery = SqlQuery + ` order by FondNum,OpisNum,DeloNum`;
        //console.log(SqlQuery);
        result = await sql.query(SqlQuery);
        res.setHeader(`content-type`, `text/plain`);
        sql.close();
        res.send(result);
       } 
    catch (error) {
      console.log(error);
    }
    
  });

  router.get('/get-cart', async (req, res) => {
    try {
        //const path1 = `L:/Arhive/Scans/Documents/CIAM/01-0002-0003-000013/`;
        const archivecode = req.query.archivecode;
        //const opisNum = req.query.opisNum;
        const fondnum = req.query.fondnum;
        const opisnum = req.query.opisnum;
        const delonum = req.query.delonum;
        //console.log(archivecode+fondnum+opisnum+delonum);
        let result;
        let SqlQuery;
        await sql.connect(config);
        if(delonum !==`null`) {
          SqlQuery = `select f.FondName fn,f.Annotation fa,o.OpisName opn,o.Annotation oan,d.DeloHeader dh
            from sprFonds f,sprOpises o, DeloHeaders d 
          where f.FondNum =${fondnum} and o.FondNum =${fondnum} and d.FondNum=${fondnum} and
          o.OpisNum=${opisnum} and d.OpisNum=${opisnum} and d.DeloNum=${delonum} and 
          f.ArhivCode=${archivecode} and o.ArhivCode=${archivecode} and d.ArhivCode=${archivecode}`;
        }
        if( delonum==`null` && opisnum !== `null`) {
          SqlQuery = `select f.FondName fn,f.Annotation fa,o.OpisName opn,o.Annotation oan
            from sprFonds f,sprOpises o
          where f.FondNum =${fondnum} and o.FondNum =${fondnum} and
          o.OpisNum=${opisnum} and 
          f.ArhivCode=${archivecode} and o.ArhivCode=${archivecode}`;
        }
        if ( fondnum !==`null` && opisnum == `null` && delonum == `null`){
          SqlQuery = `select f.FondName fn,f.Annotation fa
          from sprFonds f where f.FondNum =${fondnum} and f.ArhivCode=${archivecode}`;
          } 
          // if (fondnum !==`null`) {
        //   result = await sql.query(`SELECT FondName,Annotation from sprFonds where ArhivCode=${archivecode} 
        //   and FondNum = ${fondnum}`);
        // }
        //console.log(SqlQuery);
        result = await sql.query(SqlQuery);
        console.log(result);
        res.setHeader(`content-type`, `text/plain`);
        sql.close();
        if (result.rowsAffected[0] !==0) {
          res.send(result);
        }
        else {res.send(`0`);}
        
    } 
    catch (error) {
      console.log(error);
    }
  });

  router.post('/get-exists', async (req, res) => {
    try {
        //const path1 = `L:/Arhive/Scans/Documents/CIAM/01-0002-0003-000013/`;
        const archivecode = req.body.archivecode;
        //const opisNum = req.query.opisNum;
        const fondnum = req.body.fondnum;
        const opisnum = req.body.opisnum;
        const delonum = req.body.delonum;
        const delolit = req.body.delolit;
       // console.log(archivecode+fondnum+opisnum+delonum+delolit);
        let result;
        let SqlQuery;
        await sql.connect(config);
        if(delolit !==``) {
          SqlQuery = `select scandocid from scandocsinfo
          where FondNum =${fondnum} and
          OpisNum=${opisnum} and DeloNum=${delonum} and DeloLitera='${delolit}' and ArhivCode=${archivecode}`;
        }
        else {
          SqlQuery = `select scandocid from scandocsinfo
          where FondNum =${fondnum} and OpisNum=${opisnum} and DeloNum=${delonum} and ArhivCode=${archivecode}`;
        }
       // console.log(SqlQuery);
        result = await sql.query(SqlQuery);
        
        res.setHeader(`content-type`, `text/plain`);
        sql.close();
        if (result.rowsAffected[0] !==0) {
          res.send(`1`);
        }
        else {res.send(`0`);}
        
    } 
    catch (error) {
      console.log(error);
    }
  });

  router.post('/get-nextseq', async (req, res) => {
    try {
        //const path1 = `L:/Arhive/Scans/Documents/CIAM/01-0002-0003-000013/`;
        const tablename = req.body.tablename;
        
       console.log(tablename);
        let result;
        let SqlQuery;
        let SqlUpdate;
        let result1;
        await sql.connect(config);
        
        SqlQuery = `SELECT CurVal FROM AllSeq WHERE TableName ='${tablename}'`;
        
       // console.log(SqlQuery);
        result = await sql.query(SqlQuery);
        
        res.setHeader(`content-type`, `text/plain`);
        
        // let curval = result.recordset[0].CurVal;
        // let nextval = curval + 1;
        //sql.close();
        //await sql.connect(config);
        // SqlUpdate = `UPDATE AllSeq SET CurVal = ${nextval} WHERE TableName = '${tablename}'`;
        // result1 = await sql.query(SqlUpdate);
        //console.log(result1);
        //sql.close();
        res.send(result);
    } 
    catch (error) {
      console.log(error);
    }
  });

  router.post('/get-updateseq', async (req, res) => {
    try {
        //const path1 = `L:/Arhive/Scans/Documents/CIAM/01-0002-0003-000013/`;
        const tablename = req.body.tablename;
        
       console.log(tablename);
        let result;
        let SqlQuery;
        let SqlUpdate;
        let result1;
        await sql.connect(config);
        
        SqlQuery = `SELECT CurVal FROM AllSeq WHERE TableName ='${tablename}'`;
        
       // console.log(SqlQuery);
        result = await sql.query(SqlQuery);
        
        res.setHeader(`content-type`, `text/plain`);
        
        let curval = result.recordset[0].CurVal;
        let nextval = curval + 1;
        //sql.close();
        //await sql.connect(config);
        SqlUpdate = `UPDATE AllSeq SET CurVal = ${nextval} WHERE TableName = '${tablename}'`;
        result1 = await sql.query(SqlUpdate);
        //console.log(result1);
        //sql.close();
        res.send(`1`);
    } 
    catch (error) {
      console.log(error);
    }
  });

module.exports = router; 
