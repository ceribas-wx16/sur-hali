/* =========================================================
   SUR HALI YÖNETİM PANELİ
   admin-panel.css
   Bölüm 1 / 4
   ========================================================= */


/* =========================================================
   RESET
   ========================================================= */

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

html{

    scroll-behavior:smooth;

}

body{

    font-family:Arial,Helvetica,sans-serif;

    background:#f3f5f7;

    color:#333;

    overflow:hidden;

}


/* =========================================================
   SCROLLBAR
   ========================================================= */

::-webkit-scrollbar{

    width:10px;

}

::-webkit-scrollbar-track{

    background:#ececec;

}

::-webkit-scrollbar-thumb{

    background:#198754;

    border-radius:20px;

}

::-webkit-scrollbar-thumb:hover{

    background:#146c43;

}


/* =========================================================
   ANA YAPI
   ========================================================= */

.admin-layout{

    display:flex;

    width:100%;

    height:100vh;

    overflow:hidden;

}


/* =========================================================
   SOL MENÜ
   ========================================================= */

.sidebar{

    position:fixed;

    left:0;

    top:0;

    width:270px;

    height:100vh;

    background:#0f5132;

    color:#fff;

    display:flex;

    flex-direction:column;

    box-shadow:5px 0 18px rgba(0,0,0,.15);

    z-index:1000;

}


.logo{

    padding:35px 25px;

    text-align:center;

    border-bottom:1px solid rgba(255,255,255,.15);

}


.logo h2{

    font-size:30px;

    margin-bottom:10px;

    font-weight:bold;

}


.logo span{

    opacity:.8;

    font-size:15px;

    letter-spacing:.5px;

}


/* =========================================================
   MENÜ
   ========================================================= */

.menu{

    display:flex;

    flex-direction:column;

    padding:20px;

    gap:10px;

    flex:1;

}


.menu-item{

    border:none;

    background:transparent;

    color:#fff;

    font-size:16px;

    text-align:left;

    padding:16px 18px;

    border-radius:10px;

    cursor:pointer;

    transition:.25s;

}


.menu-item:hover{

    background:rgba(255,255,255,.12);

    transform:translateX(5px);

}


.menu-item.active{

    background:#198754;

    font-weight:bold;

    box-shadow:0 5px 15px rgba(0,0,0,.18);

}


.logout{

    margin-top:auto;

    background:#c62828;

}


.logout:hover{

    background:#a91d1d;

}


/* =========================================================
   SAĞ İÇERİK
   ========================================================= */

.content{

    margin-left:270px;

    width:calc(100% - 270px);

    height:100vh;

    overflow-y:auto;

    overflow-x:hidden;

    padding:40px;

    background:#f3f5f7;

}


/* =========================================================
   SAYFALAR
   ========================================================= */

.page{

    display:none;

    animation:fade .25s ease;

}

.active-page{

    display:block;

}


@keyframes fade{

    from{

        opacity:0;

        transform:translateY(10px);

    }

    to{

        opacity:1;

        transform:translateY(0);

    }

}


/* =========================================================
   BAŞLIKLAR
   ========================================================= */

.page h1{

    font-size:34px;

    margin-bottom:30px;

    color:#222;

    font-weight:bold;

}


/* =========================================================
   BÖLÜM BAŞLIĞI
   ========================================================= */

.section-header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:30px;

}


.section-header button{

    border:none;

    background:#198754;

    color:#fff;

    padding:14px 24px;

    border-radius:10px;

    cursor:pointer;

    font-size:16px;

    font-weight:bold;

    transition:.25s;

}


.section-header button:hover{

    background:#146c43;

    transform:translateY(-2px);

}
/* =========================================================
   DASHBOARD KARTLARI
   ========================================================= */

.cards{

    display:grid;

    grid-template-columns:repeat(auto-fit,minmax(250px,1fr));

    gap:25px;

    margin-bottom:35px;

}

.card{

    background:#fff;

    border-radius:18px;

    padding:28px;

    box-shadow:0 10px 25px rgba(0,0,0,.08);

    transition:.25s;

}

.card:hover{

    transform:translateY(-6px);

    box-shadow:0 15px 35px rgba(0,0,0,.12);

}

.card h3{

    color:#777;

    font-size:18px;

    margin-bottom:18px;

    font-weight:600;

}

.card p{

    font-size:40px;

    color:#198754;

    font-weight:bold;

}


/* =========================================================
   TABLOLAR
   ========================================================= */

.admin-table{

    width:100%;

    border-collapse:collapse;

    background:#fff;

    border-radius:16px;

    overflow:hidden;

    box-shadow:0 10px 25px rgba(0,0,0,.08);

}

.admin-table thead{

    background:#198754;

    color:#fff;

}

.admin-table th{

    padding:18px;

    text-align:left;

    font-size:15px;

}

.admin-table td{

    padding:18px;

    border-bottom:1px solid #ececec;

    vertical-align:middle;

}

.admin-table tbody tr{

    transition:.2s;

}

.admin-table tbody tr:hover{

    background:#f7f7f7;

}

.admin-table img{

    width:70px;

    height:70px;

    object-fit:cover;

    border-radius:10px;

}

.admin-table button{

    border:none;

    border-radius:8px;

    padding:8px 14px;

    cursor:pointer;

    font-weight:bold;

    margin-right:8px;

    transition:.25s;

}

.admin-table button:first-child{

    background:#0d6efd;

    color:#fff;

}

.admin-table button:first-child:hover{

    background:#0b5ed7;

}

.admin-table button:last-child{

    background:#dc3545;

    color:#fff;

}

.admin-table button:last-child:hover{

    background:#bb2d3b;

}


/* =========================================================
   FORM ELEMANLARI
   ========================================================= */

.form-group{

    margin-bottom:22px;

}

.form-group label{

    display:block;

    margin-bottom:8px;

    font-weight:bold;

    color:#444;

}

.form-group input,

.form-group textarea,

.form-group select{

    width:100%;

    padding:14px 16px;

    border:1px solid #dcdcdc;

    border-radius:10px;

    font-size:15px;

    transition:.25s;

    background:#fff;

}

.form-group textarea{

    resize:vertical;

    min-height:120px;

}

.form-group input:focus,

.form-group textarea:focus,

.form-group select:focus{

    outline:none;

    border-color:#198754;

    box-shadow:0 0 0 4px rgba(25,135,84,.15);

}


/* =========================================================
   NORMAL BUTONLAR
   ========================================================= */

button{

    transition:.25s;

}

button:hover{

    transform:translateY(-2px);

}


/* =========================================================
   AYARLAR FORMU
   ========================================================= */

#settingsForm{

    background:#fff;

    padding:30px;

    border-radius:18px;

    box-shadow:0 10px 25px rgba(0,0,0,.08);

    max-width:800px;

}

#settingsForm button{

    background:#198754;

    color:#fff;

    border:none;

    padding:15px 28px;

    border-radius:10px;

    cursor:pointer;

    font-size:16px;

    font-weight:bold;

}

#settingsForm button:hover{

    background:#146c43;

}
/* =========================================================
   RESİM YÜKLEME
   ========================================================= */

.upload-box{

    background:#ffffff;

    border-radius:18px;

    padding:30px;

    box-shadow:0 10px 25px rgba(0,0,0,.08);

    display:flex;

    align-items:center;

    gap:20px;

    flex-wrap:wrap;

    margin-bottom:35px;

}

.upload-box input[type=file]{

    flex:1;

    min-width:250px;

    border:2px dashed #198754;

    padding:15px;

    border-radius:10px;

    background:#f8fff9;

}

.upload-box button{

    background:#198754;

    color:#fff;

    border:none;

    padding:14px 30px;

    border-radius:10px;

    cursor:pointer;

    font-weight:bold;

    font-size:15px;

}

.upload-box button:hover{

    background:#146c43;

}


/* =========================================================
   RESİM GALERİSİ
   ========================================================= */

.image-gallery{

    display:grid;

    grid-template-columns:repeat(auto-fill,minmax(220px,1fr));

    gap:25px;

}

.image-card{

    background:#fff;

    border-radius:16px;

    padding:15px;

    text-align:center;

    box-shadow:0 8px 20px rgba(0,0,0,.08);

    transition:.25s;

}

.image-card:hover{

    transform:translateY(-5px);

    box-shadow:0 15px 35px rgba(0,0,0,.12);

}

.image-card img{

    width:100%;

    height:180px;

    object-fit:cover;

    border-radius:12px;

}

.image-card p{

    margin:15px 0;

    font-size:14px;

    word-break:break-word;

}

.delete-image{

    width:100%;

    border:none;

    background:#dc3545;

    color:#fff;

    padding:12px;

    border-radius:8px;

    cursor:pointer;

    font-weight:bold;

}

.delete-image:hover{

    background:#bb2d3b;

}


/* =========================================================
   MODAL
   ========================================================= */

.modal{

    display:none;

    position:fixed;

    inset:0;

    background:rgba(0,0,0,.55);

    justify-content:center;

    align-items:center;

    padding:30px;

    z-index:9999;

    overflow-y:auto;

}

.modal-content{

    width:100%;

    max-width:720px;

    background:#fff;

    border-radius:18px;

    overflow:hidden;

    box-shadow:0 25px 60px rgba(0,0,0,.25);

    animation:modalAc .25s ease;

}

@keyframes modalAc{

    from{

        opacity:0;

        transform:translateY(-30px);

    }

    to{

        opacity:1;

        transform:translateY(0);

    }

}


/* =========================================================
   MODAL HEADER
   ========================================================= */

.modal-header{

    background:#198754;

    color:#fff;

    padding:22px 30px;

    display:flex;

    justify-content:space-between;

    align-items:center;

}

.modal-header h2{

    font-size:24px;

}

.close{

    font-size:34px;

    cursor:pointer;

    transition:.2s;

}

.close:hover{

    transform:scale(1.15);

}


/* =========================================================
   MODAL BODY
   ========================================================= */

.modal-body{

    padding:30px;

    max-height:65vh;

    overflow-y:auto;

}


/* =========================================================
   MODAL FOOTER
   ========================================================= */

.modal-footer{

    padding:25px 30px;

    display:flex;

    justify-content:flex-end;

    border-top:1px solid #eee;

}

.modal-footer button{

    background:#198754;

    color:#fff;

    border:none;

    padding:15px 35px;

    border-radius:10px;

    cursor:pointer;

    font-size:16px;

    font-weight:bold;

}

.modal-footer button:hover{

    background:#146c43;

}
/* =========================================================
   RESPONSIVE
   ========================================================= */

@media (max-width:1200px){

    .cards{

        grid-template-columns:repeat(2,1fr);

    }

}

@media (max-width:992px){

    .sidebar{

        width:220px;

    }

    .content{

        margin-left:220px;

        width:calc(100% - 220px);

        padding:30px;

    }

}

@media (max-width:768px){

    body{

        overflow:auto;

    }

    .admin-layout{

        flex-direction:column;

        height:auto;

    }

    .sidebar{

        position:relative;

        width:100%;

        height:auto;

    }

    .content{

        width:100%;

        margin-left:0;

        height:auto;

        overflow:visible;

        padding:20px;

    }

    .menu{

        flex-direction:row;

        flex-wrap:wrap;

        justify-content:center;

    }

    .menu-item{

        flex:1 1 45%;

        text-align:center;

    }

    .cards{

        grid-template-columns:1fr;

    }

    .section-header{

        flex-direction:column;

        align-items:flex-start;

        gap:15px;

    }

    .upload-box{

        flex-direction:column;

        align-items:stretch;

    }

    .admin-table{

        display:block;

        overflow-x:auto;

        white-space:nowrap;

    }

    .modal{

        padding:15px;

    }

    .modal-content{

        max-width:100%;

    }

}

@media (max-width:480px){

    .logo h2{

        font-size:24px;

    }

    .page h1{

        font-size:26px;

    }

    .card{

        padding:20px;

    }

    .card p{

        font-size:30px;

    }

    .modal-header{

        padding:18px;

    }

    .modal-body{

        padding:20px;

    }

    .modal-footer{

        padding:20px;

    }

    .modal-footer button{

        width:100%;

    }

}


/* =========================================================
   YARDIMCI SINIFLAR
   ========================================================= */

.hidden{

    display:none !important;

}

.text-center{

    text-align:center;

}

.mt-20{

    margin-top:20px;

}

.mb-20{

    margin-bottom:20px;

}

.w-100{

    width:100%;

}
