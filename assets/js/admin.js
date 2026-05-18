$(document).ready(function() {
            
    // 1. Simulasi Login
    $("#btn-login").click(function() {
        $("#login-screen").fadeOut(500, function() {
            $("#dashboard-screen").fadeIn(500);
        });
    });

    // 2. Simulasi Logout
    $("#btn-logout").click(function() {
        $("#dashboard-screen").fadeOut(300, function() {
            $("#login-screen").fadeIn(300);
        });
    });

    // 3. Tab Navigation (Sidebar)
    $(".nav-link").click(function() {
        $(".nav-link").removeClass("active");
        $(this).addClass("active");

        let targetPanel = $(this).data("target");

        $(".panel").hide();
        $(targetPanel).fadeIn(400);
    });

    // 4. Interaksi Form Jadwal
    $("#status-laga").change(function() {
        if ($(this).val() === "Selesai") {
            $("#input-skor").slideDown();
        } else {
            $("#input-skor").slideUp();
        }
    });

    // 5. Simpan Data Pemain ke LocalStorage
    $("#form-pemain").submit(function(e) {
        e.preventDefault(); 
        
        let nama = $("#input-nama").val();
        let posisi = $("#input-posisi").val();
        let nomor = $("#input-nomor").val();
        let foto = $("#input-foto").val(); // Mengambil link foto

        let pemainBaru = {
            nama: nama,
            posisi: posisi,
            nomor: nomor,
            foto: foto 
        };

        let dataPemain = JSON.parse(localStorage.getItem("dataSkuadMU")) || [];
        dataPemain.push(pemainBaru);

        localStorage.setItem("dataSkuadMU", JSON.stringify(dataPemain));

        alert("Berhasil! " + nama + " telah ditambahkan ke skuad.");
        
        $(this).trigger("reset"); 
    });

});