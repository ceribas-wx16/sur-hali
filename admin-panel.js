/* ==========================================================
   SUR HALI İZNİK
   ADMIN PANEL
   Bölüm 1
   - Başlatma
   - Oturum Kontrolü
   - Menü
   - Çıkış
========================================================== */

console.clear();
console.log("Sur Halı Admin Panel Başlatılıyor...");

/* ==========================================================
   SAYFA YÜKLENDİ
========================================================== */

document.addEventListener("DOMContentLoaded", async () => {

    try {

        await oturumKontrol();

        menuHazirla();

        cikisHazirla();

        modalHazirla();

        await dashboardYukle();

        await urunleriGetir();

        await resimleriGetir();

        await ayarlariGetir();

        console.log("Admin Panel Hazır");

    } catch (err) {

        console.error("Başlatma hatası:", err);

    }

});


/* ==========================================================
   OTURUM KONTROLÜ
========================================================== */

async function oturumKontrol() {

    const { data, error } =
        await supabase.auth.getSession();

    if (error) {

        console.error(error);

        window.location.href = "admin-giris.html";

        return;

    }

    if (!data.session) {

        window.location.href = "admin-giris.html";

        return;

    }

    console.log(
        "Giriş:",
        data.session.user.email
    );

}


/* ==========================================================
   SOL MENÜ
========================================================== */

function menuHazirla() {

    const menuItems =
        document.querySelectorAll(".menu-item");

    const pages =
        document.querySelectorAll(".page");

    menuItems.forEach(item => {

        item.addEventListener("click", () => {

            if (item.id === "logoutButton")
                return;

            menuItems.forEach(button =>
                button.classList.remove("active")
            );

            pages.forEach(page =>
                page.classList.remove("active-page")
            );

            item.classList.add("active");

            const target =
                document.getElementById(
                    item.dataset.page
                );

            if (target) {

                target.classList.add(
                    "active-page"
                );

            }

        });

    });

}


/* ==========================================================
   MODAL
========================================================== */

function modalHazirla() {

    const modal =
        document.getElementById("productModal");

    const openButton =
        document.getElementById("newProductButton");

    const closeButton =
        document.getElementById("closeModal");

    if (!modal)
        return;

    openButton?.addEventListener("click", () => {

        modal.style.display = "flex";

    });

    closeButton?.addEventListener("click", () => {

        modal.style.display = "none";

    });

    window.addEventListener("click", (e) => {

        if (e.target === modal) {

            modal.style.display = "none";

        }

    });

}


/* ==========================================================
   ÇIKIŞ
========================================================== */

function cikisHazirla() {

    const logoutButton =
        document.getElementById("logoutButton");

    if (!logoutButton)
        return;

    logoutButton.addEventListener("click", async () => {

        const cevap =
            confirm("Çıkış yapmak istiyor musunuz?");

        if (!cevap)
            return;

        try {

            await supabase.auth.signOut();

            window.location.href =
                "admin-giris.html";

        } catch (err) {

            console.error(err);

            alert("Çıkış yapılamadı.");

        }

    });

}

/* ==========================================================
   SUR HALI İZNİK
   ADMIN PANEL
   Bölüm 2
   Dashboard
========================================================== */


/* ==========================================================
   DASHBOARD
========================================================== */

async function dashboardYukle() {

    console.log("Dashboard yükleniyor...");

    await toplamUrunSayisi();

    await toplamResimSayisi();

    await storageBilgisi();

}


/* ==========================================================
   TOPLAM ÜRÜN SAYISI
========================================================== */

async function toplamUrunSayisi() {

    try {

        const { count, error } = await supabase
            .from("products")
            .select("*", {
                count: "exact",
                head: true
            });

        if (error) {

            console.error(error);

            return;

        }

        const alan =
            document.getElementById("totalProducts");

        if (alan) {

            alan.textContent = count || 0;

        }

    }

    catch (err) {

        console.error(err);

    }

}


/* ==========================================================
   TOPLAM RESİM SAYISI
========================================================== */

async function toplamResimSayisi() {

    try {

        const { data, error } =
            await supabase.storage
                .from("halilar")
                .list();

        if (error) {

            console.error(error);

            return;

        }

        const alan =
            document.getElementById("totalImages");

        if (alan) {

            alan.textContent =
                data ? data.length : 0;

        }

    }

    catch (err) {

        console.error(err);

    }

}


/* ==========================================================
   STORAGE KULLANIMI
========================================================== */

async function storageBilgisi() {

    try {

        const { data, error } =
            await supabase.storage
                .from("halilar")
                .list();

        if (error) {

            console.error(error);

            return;

        }

        let toplam = 0;

        data.forEach(file => {

            if (file.metadata?.size) {

                toplam += Number(file.metadata.size);

            }

        });

        let sonuc = "0 B";

        if (toplam >= 1024 && toplam < 1024 * 1024) {

            sonuc =
                (toplam / 1024).toFixed(1) + " KB";

        }

        if (toplam >= 1024 * 1024) {

            sonuc =
                (toplam / 1024 / 1024).toFixed(2) + " MB";

        }

        const alan =
            document.getElementById("storageUsage");

        if (alan) {

            alan.textContent = sonuc;

        }

    }

    catch (err) {

        console.error(err);

    }

}


/* ==========================================================
   AYARLARI GETİR
========================================================== */

async function ayarlariGetir() {

    try {

        const { data, error } =
            await supabase
                .from("settings")
                .select("*")
                .limit(1)
                .maybeSingle();

        if (error) {

            console.log("Settings tablosu kullanılmıyor.");

            return;

        }

        if (!data)
            return;

        const title =
            document.getElementById("siteTitle");

        const phone =
            document.getElementById("sitePhone");

        const address =
            document.getElementById("siteAddress");

        if (title)
            title.value = data.site_title || "";

        if (phone)
            phone.value = data.phone || "";

        if (address)
            address.value = data.address || "";

    }

    catch (err) {

        console.error(err);

    }

}

