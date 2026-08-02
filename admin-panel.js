/* =========================================================
   SUR HALI İZNİK
   ADMIN PANEL
   admin-panel.js

   Bölüm 1 / 4

   - Supabase Kontrolü
   - Sayfa Başlatma
   - Oturum Kontrolü
   - Menü Yönetimi
   - Çıkış İşlemi
========================================================= */

console.log("Sur Halı Admin Panel başlatılıyor...");


/* =========================================================
   SAYFA YÜKLENİNCE
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    console.log("DOM yüklendi.");

    await oturumKontrol();

    menuHazirla();

    cikisHazirla();

    modalHazirla();

    dashboardYukle();

    urunleriGetir();

    resimleriGetir();

    ayarlariGetir();

});


/* =========================================================
   OTURUM KONTROLÜ
========================================================= */

async function oturumKontrol(){

    try{

        const { data, error } =
        await supabase.auth.getSession();

        if(error){

            console.error(error);

            location.href="admin-giris.html";

            return;

        }

        if(!data.session){

            location.href="admin-giris.html";

            return;

        }

        console.log(
            "Giriş yapan kullanıcı:",
            data.session.user.email
        );

    }

    catch(err){

        console.error(err);

        location.href="admin-giris.html";

    }

}


/* =========================================================
   SOL MENÜ
========================================================= */

function menuHazirla(){

    const buttons =
    document.querySelectorAll(".menu-item");

    const pages =
    document.querySelectorAll(".page");

    buttons.forEach(button=>{

        button.addEventListener("click",()=>{

            if(button.id==="logoutButton") return;

            buttons.forEach(item=>{

                item.classList.remove("active");

            });

            pages.forEach(page=>{

                page.classList.remove("active-page");

            });

            button.classList.add("active");

            const target =
            document.getElementById(
                button.dataset.page
            );

            if(target){

                target.classList.add(
                    "active-page"
                );

            }

        });

    });

}


/* =========================================================
   ÇIKIŞ
========================================================= */

function cikisHazirla(){

    const logoutButton =
    document.getElementById(
        "logoutButton"
    );

    if(!logoutButton) return;

    logoutButton.onclick =
    async()=>{

        if(
            !confirm(
                "Çıkış yapmak istiyor musunuz?"
            )
        ){
            return;
        }

        await supabase.auth.signOut();

        location.href="admin-giris.html";

    };

}
/* =========================================================
   SUR HALI İZNİK
   ADMIN PANEL
   admin-panel.js

   Bölüm 2 / 4

   - Dashboard
   - Ürün Sayısı
   - Resim Sayısı
   - Storage Bilgisi
   - Site Ayarlarını Yükleme
========================================================= */


/* =========================================================
   DASHBOARD
========================================================= */

async function dashboardYukle(){

    console.log("Dashboard yükleniyor...");

    await toplamUrunSayisi();

    await toplamResimSayisi();

    await storageBilgisi();

}


/* =========================================================
   TOPLAM ÜRÜN SAYISI
========================================================= */

async function toplamUrunSayisi(){

    try{

        const {

            count,

            error

        } = await supabase

        .from("products")

        .select("*",{

            count:"exact",

            head:true

        });

        if(error){

            console.error(error);

            return;

        }

        const alan =
        document.getElementById(
            "totalProducts"
        );

        if(alan){

            alan.innerText = count ?? 0;

        }

    }

    catch(err){

        console.error(err);

    }

}


/* =========================================================
   TOPLAM RESİM SAYISI
========================================================= */

async function toplamResimSayisi(){

    try{

        const {

            data,

            error

        } = await supabase

        .storage

        .from("halilar")

        .list();

        if(error){

            console.error(error);

            return;

        }

        const alan =
        document.getElementById(
            "totalImages"
        );

        if(alan){

            alan.innerText =
            data.length;

        }

    }

    catch(err){

        console.error(err);

    }

}


/* =========================================================
   STORAGE BİLGİSİ
========================================================= */

async function storageBilgisi(){

    try{

        const {

            data,

            error

        } = await supabase

        .storage

        .from("halilar")

        .list();

        if(error){

            console.error(error);

            return;

        }

        let toplamByte = 0;

        data.forEach(file=>{

            if(file.metadata){

                toplamByte +=
                Number(
                    file.metadata.size || 0
                );

            }

        });

        let sonuc = "";

        if(toplamByte < 1024){

            sonuc =
            toplamByte + " B";

        }

        else if(toplamByte < 1024*1024){

            sonuc =
            (
                toplamByte/1024
            ).toFixed(1) + " KB";

        }

        else{

            sonuc =
            (
                toplamByte/
                1024/
                1024
            ).toFixed(2) + " MB";

        }

        const alan =
        document.getElementById(
            "storageUsage"
        );

        if(alan){

            alan.innerText =
            sonuc;

        }

    }

    catch(err){

        console.error(err);

    }

}


/* =========================================================
   SİTE AYARLARINI GETİR
========================================================= */

async function ayarlariGetir(){

    try{

        const {

            data,

            error

        } = await supabase

        .from("settings")

        .select("*")

        .limit(1)

        .single();

        if(error){

            console.log(
                "Settings tablosu henüz kullanılmıyor."
            );

            return;

        }

        if(!data){

            return;

        }

        if(document.getElementById("siteTitle")){

            document.getElementById("siteTitle").value =
            data.site_title ?? "";

        }

        if(document.getElementById("sitePhone")){

            document.getElementById("sitePhone").value =
            data.phone ?? "";

        }

        if(document.getElementById("siteAddress")){

            document.getElementById("siteAddress").value =
            data.address ?? "";

        }

    }

    catch(err){

        console.error(err);

    }

}

/* =========================================================
   SUR HALI İZNİK
   ADMIN PANEL
   admin-panel.js

   Bölüm 3 / 4

   - Ürünleri Listele
   - Yeni Ürün Penceresi
   - Ürün Kaydet
   - Ürün Sil
========================================================= */


/* =========================================================
   MODAL
========================================================= */

function modalHazirla(){

    const modal =
    document.getElementById("productModal");

    const openButton =
    document.getElementById("newProductButton");

    const closeButton =
    document.getElementById("closeModal");

    if(!modal) return;

    if(openButton){

        openButton.onclick=()=>{

            modal.style.display="flex";

        };

    }

    if(closeButton){

        closeButton.onclick=()=>{

            modal.style.display="none";

        };

    }

    window.onclick=(e)=>{

        if(e.target===modal){

            modal.style.display="none";

        }

    };

}


/* =========================================================
   ÜRÜNLERİ GETİR
========================================================= */

async function urunleriGetir(){

    const tbody =
    document.getElementById(
        "productTableBody"
    );

    if(!tbody) return;

    tbody.innerHTML="";

    const {

        data,

        error

    } = await supabase

    .from("products")

    .select("*")

    .order("created_at",{

        ascending:false

    });

    if(error){

        console.error(error);

        return;

    }

    data.forEach(product=>{

        tbody.innerHTML +=`

<tr>

<td>${product.name}</td>

<td>${product.category}</td>

<td>${product.is_active ? "Aktif" : "Pasif"}</td>

<td>

<button
onclick="urunSil('${product.id}')">

Sil

</button>

</td>

</tr>

`;

    });

    dashboardYukle();

}


/* =========================================================
   ÜRÜN KAYDET
========================================================= */

async function urunKaydet(){

    const name =
    document.getElementById("productName").value.trim();

    const category =
    document.getElementById("productCategory").value.trim();

    const size =
    document.getElementById("productSize").value.trim();

    const price =
    Number(
    document.getElementById("productPrice").value
    );

    const description =
    document.getElementById("productDescription").value.trim();

    const imageFile =
    document.getElementById("productImage").files[0];

    if(name==="" || category===""){

        alert("Ürün adı ve kategori zorunludur.");

        return;

    }

    let imageUrl="";

    if(imageFile){

        const fileName=
        Date.now()+"-"+imageFile.name;

        const {

            error

        } = await supabase

        .storage

        .from("halilar")

        .upload(fileName,imageFile);

        if(error){

            alert(error.message);

            return;

        }

        imageUrl=

        supabase

        .storage

        .from("halilar")

        .getPublicUrl(fileName)

        .data.publicUrl;

    }

    const {

        error

    } = await supabase

    .from("products")

    .insert([{

        name,

        category,

        size,

        price,

        description,

        image_url:imageUrl,

        is_active:true

    }]);

    if(error){

        alert(error.message);

        return;

    }

    alert("Ürün başarıyla eklendi.");

    document.getElementById("productModal").style.display="none";

    document.getElementById("productName").value="";
    document.getElementById("productCategory").value="";
    document.getElementById("productSize").value="";
    document.getElementById("productPrice").value="";
    document.getElementById("productDescription").value="";
    document.getElementById("productImage").value="";

    urunleriGetir();

}


/* =========================================================
   KAYDET BUTONU
========================================================= */

const saveButton =
document.getElementById(
"saveProductButton"
);

if(saveButton){

    saveButton.addEventListener(

        "click",

        urunKaydet

    );

}


/* =========================================================
   ÜRÜN SİL
========================================================= */

async function urunSil(id){

    if(

        !confirm("Bu ürün silinsin mi?")

    ){

        return;

    }

    const {

        error

    } = await supabase

    .from("products")

    .delete()

    .eq("id",id);

    if(error){

        alert(error.message);

        return;

    }

    urunleriGetir();

}

/* =========================================================
   SUR HALI İZNİK
   ADMIN PANEL
   admin-panel.js

   Bölüm 4 / 4

   - Resimleri Listele
   - Resim Yükle
   - Resim Sil
   - Yardımcı Fonksiyonlar

========================================================= */


/* =========================================================
   RESİMLERİ GETİR
========================================================= */

async function resimleriGetir(){

    const gallery =
    document.getElementById("imageGallery");

    if(!gallery) return;

    gallery.innerHTML="";

    const { data, error } =
    await supabase
    .storage
    .from("halilar")
    .list();

    if(error){

        console.error(error);

        return;

    }

    if(data.length===0){

        gallery.innerHTML=
        "<p>Henüz resim yüklenmemiş.</p>";

        return;

    }

    data.forEach(file=>{

        const publicUrl=
        supabase
        .storage
        .from("halilar")
        .getPublicUrl(file.name)
        .data.publicUrl;

        gallery.innerHTML +=`

<div class="image-card">

<img src="${publicUrl}" alt="">

<p>${file.name}</p>

<button
class="delete-image"
onclick="resimSil('${file.name}')">

🗑 Resmi Sil

</button>

</div>

`;

    });

}


/* =========================================================
   RESİM YÜKLE
========================================================= */

const uploadButton=
document.getElementById(
"uploadImageButton"
);

if(uploadButton){

uploadButton.onclick=
async()=>{

const file=
document.getElementById("imageInput").files[0];

if(!file){

alert("Lütfen resim seçiniz.");

return;

}

const fileName=
Date.now()+"-"+file.name;

const { error }=
await supabase
.storage
.from("halilar")
.upload(fileName,file);

if(error){

alert(error.message);

return;

}

alert("Resim başarıyla yüklendi.");

document.getElementById("imageInput").value="";

resimleriGetir();

dashboardYukle();

};

}


/* =========================================================
   RESİM SİL
========================================================= */

async function resimSil(fileName){

if(!confirm("Bu resim silinsin mi?")){

return;

}

const { error }=
await supabase
.storage
.from("halilar")
.remove([fileName]);

if(error){

alert(error.message);

return;

}

alert("Resim silindi.");

resimleriGetir();

dashboardYukle();

}


/* =========================================================
   YARDIMCI
========================================================= */

function paraFormati(fiyat){

return Number(fiyat).toLocaleString(

"tr-TR",

{

style:"currency",

currency:"TRY"

}

);

}


/* =========================================================
   TARİH FORMATI
========================================================= */

function tarihFormati(tarih){

if(!tarih) return "";

return new Date(tarih)
.toLocaleDateString(

"tr-TR",

{

day:"2-digit",

month:"2-digit",

year:"numeric"

}

);

}


/* =========================================================
   GENEL HATA YAKALAMA
========================================================= */

window.addEventListener(

"error",

function(event){

console.error(

"Javascript Hatası:",

event.error

);

}

);

console.log(

"Sur Halı Yönetim Paneli başarıyla yüklendi."

);
