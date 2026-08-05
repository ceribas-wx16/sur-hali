/* ==========================================================
   SUR HALI İZNİK
   ADMIN PANEL
   BÖLÜM 1
========================================================== */

console.log("Admin Panel Başlatılıyor...");

/* ==========================================================
   SAYFA YÜKLENDİ
========================================================== */

document.addEventListener("DOMContentLoaded", async () => {

    console.log("DOM Hazır");

    await oturumKontrol();

    menuHazirla();

    cikisHazirla();

    modalHazirla();

    dashboardYukle();

    urunleriGetir();

    resimleriGetir();

    ayarlariGetir();

});


/* ==========================================================
   OTURUM KONTROLÜ
========================================================== */

async function oturumKontrol() {

    try {

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
            "Giriş yapan:",
            data.session.user.email
        );

    }

    catch (err) {

        console.error(err);

        window.location.href = "admin-giris.html";

    }

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

            if (item.id === "logoutButton") return;

            menuItems.forEach(i =>
                i.classList.remove("active")
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
   ÇIKIŞ
========================================================== */

function cikisHazirla() {

    const logoutButton =
        document.getElementById("logoutButton");

    if (!logoutButton) return;

    logoutButton.addEventListener("click", async () => {

        const cevap =
            confirm("Çıkış yapmak istiyor musunuz?");

        if (!cevap) return;

        try {

            await supabase.auth.signOut();

            window.location.href =
                "admin-giris.html";

        }

        catch (err) {

            console.error(err);

            alert("Çıkış yapılamadı.");

        }

    });

}

/* ==========================================================
   SUR HALI İZNİK
   ADMIN PANEL
   BÖLÜM 1
========================================================== */

console.log("Admin Panel Başlatılıyor...");

/* ==========================================================
   SAYFA YÜKLENDİ
========================================================== */

document.addEventListener("DOMContentLoaded", async () => {

    console.log("DOM Hazır");

    await oturumKontrol();

    menuHazirla();

    cikisHazirla();

    modalHazirla();

    dashboardYukle();

    urunleriGetir();

    resimleriGetir();

    ayarlariGetir();

});


/* ==========================================================
   OTURUM KONTROLÜ
========================================================== */

async function oturumKontrol() {

    try {

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
            "Giriş yapan:",
            data.session.user.email
        );

    }

    catch (err) {

        console.error(err);

        window.location.href = "admin-giris.html";

    }

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

            if (item.id === "logoutButton") return;

            menuItems.forEach(i =>
                i.classList.remove("active")
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
   ÇIKIŞ
========================================================== */

function cikisHazirla() {

    const logoutButton =
        document.getElementById("logoutButton");

    if (!logoutButton) return;

    logoutButton.addEventListener("click", async () => {

        const cevap =
            confirm("Çıkış yapmak istiyor musunuz?");

        if (!cevap) return;

        try {

            await supabase.auth.signOut();

            window.location.href =
                "admin-giris.html";

        }

        catch (err) {

            console.error(err);

            alert("Çıkış yapılamadı.");

        }

    });

}
