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

    // 5. Simpan Data Pemain ke Database MySQL via AJAX
    function muatTabelPemain() {
        $.ajax({
            type: "GET",
            url: "api/get_pemain.php",
            dataType: "json",
            success: function(data) {
                let tbody = $("#tabel-pemain-body");
                tbody.empty(); // Bersihkan tabel
                
                if (data.length === 0) {
                    tbody.append('<tr><td colspan="5" style="text-align:center; padding:15px;">Belum ada data pemain.</td></tr>');
                    return;
                }

                // Masukkan data ke dalam baris tabel
                data.forEach(function(pemain, index) {
                    let baris = `
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 10px; border: 1px solid #ccc; text-align: center;">${index + 1}</td>
                            <td style="padding: 10px; border: 1px solid #ccc;">${pemain.nama}</td>
                            <td style="padding: 10px; border: 1px solid #ccc;">${pemain.posisi}</td>
                            <td style="padding: 10px; border: 1px solid #ccc; text-align: center;">${pemain.nomor}</td>
                            <td style="padding: 10px; border: 1px solid #ccc; text-align: center;">
                                <button class="btn-edit" style="background: #D6A449; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px; margin-right: 5px;" 
                                    data-id="${pemain.id}" data-nama="${pemain.nama}" data-posisi="${pemain.posisi}" data-nomor="${pemain.nomor}" data-foto="${pemain.foto}">Edit</button>
                                <button class="btn-hapus" style="background: #111; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px;" 
                                    data-id="${pemain.id}">Hapus</button>
                            </td>
                        </tr>
                    `;
                    tbody.append(baris);
                });
            }
        });
    }

    // Panggil fungsi saat halaman dashboard dimuat
    muatTabelPemain();


    // B. Fungsi Create & Update (Submit Form)
    $("#form-pemain").submit(function(e) {
        e.preventDefault(); 
        
        let id = $("#input-id").val(); // Cek apakah ada ID
        let nama = $("#input-nama").val();
        let posisi = $("#input-posisi").val();
        let nomor = $("#input-nomor").val();
        let foto = $("#input-foto").val();

        // Tentukan URL API berdasarkan apakah ID kosong (Tambah Baru) atau ada isinya (Update)
        let apiUrl = id === "" ? "api/simpan_pemain.php" : "api/update_pemain.php";

        $.ajax({
            type: "POST",
            url: apiUrl,
            data: { id: id, nama: nama, posisi: posisi, nomor: nomor, foto: foto },
            dataType: "json",
            success: function(response) {
                if(response.status === "sukses") {
                    alert(response.pesan);
                    resetForm(); // Kosongkan form
                    muatTabelPemain(); // Refresh tabel otomatis
                } else {
                    alert("Gagal: " + response.pesan);
                }
            }
        });
    });


    // C. Fungsi Persiapan Edit (Saat tombol Edit di tabel diklik)
    $(document).on("click", ".btn-edit", function() {
        // Ambil data dari atribut tombol
        let id = $(this).data("id");
        let nama = $(this).data("nama");
        let posisi = $(this).data("posisi");
        let nomor = $(this).data("nomor");
        let foto = $(this).data("foto");

        // Masukkan data ke dalam form input
        $("#input-id").val(id);
        $("#input-nama").val(nama);
        $("#input-posisi").val(posisi);
        $("#input-nomor").val(nomor);
        $("#input-foto").val(foto);

        // Ubah teks tombol dan munculkan tombol batal
        $("#btn-simpan-form").text("Update Data Pemain");
        $("#btn-batal-edit").show();
        
        // Scroll ke atas (ke arah form)
        $("html, body").animate({ scrollTop: 0 }, "fast");
    });


    // D. Fungsi Delete (Saat tombol Hapus diklik)
    $(document).on("click", ".btn-hapus", function() {
        let id = $(this).data("id");
        
        // Konfirmasi sebelum menghapus
        if(confirm("Apakah Anda yakin ingin menghapus pemain ini?")) {
            $.ajax({
                type: "POST",
                url: "api/hapus_pemain.php",
                data: { id: id },
                dataType: "json",
                success: function(response) {
                    if(response.status === "sukses") {
                        alert(response.pesan);
                        muatTabelPemain(); // Refresh tabel
                    } else {
                        alert("Gagal menghapus: " + response.pesan);
                    }
                }
            });
        }
    });

    // E. Fungsi Batal Edit
    $("#btn-batal-edit").click(function() {
        resetForm();
    });

    function resetForm() {
        $("#form-pemain").trigger("reset");
        $("#input-id").val(""); // Kosongkan hidden ID
        $("#btn-simpan-form").text("Simpan Data Pemain");
        $("#btn-batal-edit").hide();
    }

});