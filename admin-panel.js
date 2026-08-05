/* ==========================================================
   SUR HALI İZNİK - ADMIN PANEL JAVASCRIPT
========================================================== */

document.addEventListener("DOMContentLoaded", async () => {
    console.log("Admin Panel Yükleniyor...");

    // Önce menü geçişlerini aktif et (Veritabanı yavaş olsa bile sekmeler anında çalışır)
    menuHazirla();
    modalHazirla();
    cikisHazirla();

    try {
        // Oturum ve Veri Yükleme
        await oturumKontrol();
        await dashboardYukle();
        await urunleriGetir();
        await resimleriGetir();
        await ayarlariGetir();
        console.log("Veriler başarıyla yüklendi.");
    } catch (err) {
        console.error("Veri yükleme hatası:", err);
    }
});

/* ==========================================================
   SEKMELER ARASI GEÇİŞ (Tıklama Mantığı)
========================================================== */
function menuHazirla() {
    const menuItems = document.querySelectorAll(".menu-item");
    const pages = document.querySelectorAll(".page");

    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            if (item.id === "logoutButton") return;

            // Tüm butonlardan active sınıfını kaldır
            menuItems.forEach(btn => btn.classList.remove("active"));
            
            // Tüm sayfaları gizle
            pages.forEach(page => page.classList.remove("active-page"));

            // Tıklanan butona active ekle
            item.classList.add("active");

            // İlgili sayfayı göster
            const targetId = item.dataset.page;
            const targetPage = document.getElementById(targetId);
            
            if (targetPage) {
                targetPage.classList.add("active-page");
            }
        });
    });
}

/* ==========================================================
   OTURUM KONTROLÜ
========================================================== */
async function oturumKontrol() {
    if (!window.supabase) return;
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
        // Giriş yapılmamışsa yönlendir (Gerekirse bu satırı test için pasife alabilirsiniz)
        // window.location.href = "admin-giris.html";
    }
}

/* ==========================================================
   MODAL İŞLEMLERİ
========================================================== */
function modalHazirla() {
    const modal = document.getElementById("productModal");
    const openBtn = document.getElementById("newProductButton");
    const closeBtn = document.getElementById("closeModal");

    if (!modal) return;

    openBtn?.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    closeBtn?.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });
}

/* ==========================================================
   ÇIKIŞ YAP
========================================================== */
function cikisHazirla() {
    const logoutButton = document.getElementById("logoutButton");
    logoutButton?.addEventListener("click", async () => {
        if (confirm("Çıkış yapmak istiyor musunuz?")) {
            await supabase.auth.signOut();
            window.location.href = "admin-giris.html";
        }
    });
}

/* ==========================================================
   DASHBOARD BİLGİLERİ
========================================================== */
async function dashboardYukle() {
    await toplamUrunSayisi();
    await toplamResimSayisi();
    await storageBilgisi();
}

async function toplamUrunSayisi() {
    try {
        const { count, error } = await supabase.from("products").select("*", { count: "exact", head: true });
        if (!error && document.getElementById("totalProducts")) {
            document.getElementById("totalProducts").textContent = count || 0;
        }
    } catch (e) { console.error(e); }
}

async function toplamResimSayisi() {
    try {
        const { data, error } = await supabase.storage.from("halilar").list();
        if (!error && document.getElementById("totalImages")) {
            document.getElementById("totalImages").textContent = data ? data.length : 0;
        }
    } catch (e) { console.error(e); }
}

async function storageBilgisi() {
    try {
        const { data, error } = await supabase.storage.from("halilar").list();
        if (error || !data) return;

        let toplam = 0;
        data.forEach(file => { if (file.metadata?.size) toplam += Number(file.metadata.size); });

        let sonuc = "0 B";
        if (toplam >= 1024 && toplam < 1024 * 1024) sonuc = (toplam / 1024).toFixed(1) + " KB";
        else if (toplam >= 1024 * 1024) sonuc = (toplam / (1024 * 1024)).toFixed(2) + " MB";

        if (document.getElementById("storageUsage")) {
            document.getElementById("storageUsage").textContent = sonuc;
        }
    } catch (e) { console.error(e); }
}

/* ==========================================================
   ÜRÜNLERİ GETİR
========================================================== */
async function urunleriGetir() {
    const tbody = document.getElementById("productTableBody");
    if (!tbody) return;

    try {
        const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
        if (error || !data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:20px;">Henüz ürün bulunmuyor.</td></tr>`;
            return;
        }

        tbody.innerHTML = "";
        data.forEach(urun => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${urun.name}</strong><br><small>${urun.size || ""}</small></td>
                <td>${urun.category}</td>
                <td>${urun.is_active ? "🟢 Aktif" : "🔴 Pasif"}</td>
                <td>
                    <button class="btn btn-secondary" onclick="urunSil('${urun.id}')">Sil</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) { console.error(e); }
}

async function urunSil(id) {
    if (confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
        await supabase.from("products").delete().eq("id", id);
        await urunleriGetir();
        await toplamUrunSayisi();
    }
}

/* ==========================================================
   RESİMLERİ GETİR
========================================================== */
async function resimleriGetir() {
    const galeri = document.getElementById("imageGallery");
    if (!galeri) return;

    try {
        const { data, error } = await supabase.storage.from("halilar").list();
        if (error || !data || data.length === 0) {
            galeri.innerHTML = `<p>Henüz yüklenmiş resim yok.</p>`;
            return;
        }

        galeri.innerHTML = "";
        data.forEach(resim => {
            const url = supabase.storage.from("halilar").getPublicUrl(resim.name).data.publicUrl;
            const div = document.createElement("div");
            div.style.cssText = "background:#fff; padding:10px; border-radius:8px; text-align:center; border:1px solid #eee;";
            div.innerHTML = `
                <img src="${url}" style="width:100%; height:100px; object-fit:cover; border-radius:4px;">
                <p style="font-size:10px; margin:5px 0; overflow:hidden;">${resim.name}</p>
            `;
            galeri.appendChild(div);
        });
    } catch (e) { console.error(e); }
}

/* ==========================================================
   AYARLARI GETİR
========================================================== */
async function ayarlariGetir() {
    try {
        const { data } = await supabase.from("settings").select("*").limit(1).maybeSingle();
        if (data) {
            if (document.getElementById("siteTitle")) document.getElementById("siteTitle").value = data.site_title || "";
            if (document.getElementById("sitePhone")) document.getElementById("sitePhone").value = data.phone || "";
            if (document.getElementById("siteAddress")) document.getElementById("siteAddress").value = data.address || "";
        }
    } catch (e) { console.error(e); }
}
