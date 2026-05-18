$(document).ready(function() {
    
    // 1. Muat Data Pemain dari Database MySQL via AJAX
    function muatDataPemain() {
        let container = $("#skuad-container");
        container.empty();
        container.append("<p>Memuat data pemain dari server...</p>");

        $.ajax({
            type: "GET",
            url: "api/get_pemain.php",
            dataType: "json",
            success: function(dataPemain) {
                container.empty(); // Bersihkan teks loading

                if(dataPemain.length === 0) {
                    container.append("<p>Belum ada data pemain. Silakan tambahkan melalui Admin Hub.</p>");
                    return;
                }

                // Looping data yang didapat dari database
                dataPemain.forEach(function(pemain) {
                    let cardHTML = `
                    <div class="flip-card">
                        <div class="flip-card-inner">
                            <div class="flip-card-front" style="background-image: url('${pemain.foto}');">
                                <div class="card-overlay"></div>
                                <h2 class="player-number">${pemain.nomor}</h2>
                                <div class="player-info">
                                    <h3>${pemain.nama}</h3>
                                    <p>${pemain.posisi}</p>
                                </div>
                            </div>
                            <div class="flip-card-back">
                                <h3>Statistik</h3>
                                <p>Gol: 0</p>
                                <p>Assist: 0</p>
                            </div>
                        </div>
                    </div>
                    `;
                    container.append(cardHTML);
                });

                // Pasang kembali efek flip pada elemen yang baru di-render
                $(".flip-card").click(function() {
                    $(this).toggleClass("is-flipped");
                });
            },
            error: function() {
                container.html("<p style='color:red;'>Gagal mengambil data dari server. Pastikan database MySQL dan XAMPP berjalan.</p>");
            }
        });
    }

    muatDataPemain();

    // 2. Timeline Slide
    $("#btn-sejarah").click(function() {
        $("#timeline-sejarah").slideToggle("slow");
        $(this).text($(this).text() == 'Buka Timeline Sejarah' ? 'Tutup Timeline Sejarah' : 'Buka Timeline Sejarah');
    });

    function muatDataJadwal() {
        let container = $("#jadwal-container");
        container.empty();
        container.append("<p>Memuat jadwal dari server...</p>");

        $.ajax({
            type: "GET",
            url: "api/get_jadwal.php",
            dataType: "json",
            success: function(dataJadwal) {
                container.empty();

                if(dataJadwal.length === 0) {
                    container.append("<p>Belum ada data jadwal pertandingan.</p>");
                    return;
                }

                dataJadwal.forEach(function(jadwal) {
                    let skorText = jadwal.status === "Selesai" ? jadwal.skor : "-";
                    let statusText = jadwal.status === "Selesai" ? "Full Time (Selesai)" : "Akan Datang";
                    
                    let accordionHTML = `
                    <div class="accordion-item">
                        <div class="accordion-header">
                            <span class="match-name">MANCHESTER UNITED VS ${jadwal.lawan.toUpperCase()}</span>
                            <span class="match-date">${jadwal.tanggal.toUpperCase()}</span>
                        </div>
                        <div class="accordion-content">
                            <p class="score-display">${skorText}</p>
                            <p><strong>Status:</strong> ${statusText}</p>
                        </div>
                    </div>
                    `;
                    container.append(accordionHTML);
                });

                // Pasang ulang interaksi klik (Accordion) untuk elemen baru
                $(".accordion-header").off("click").on("click", function() {
                    $(".accordion-content").not($(this).next()).slideUp("fast");
                    $(this).next(".accordion-content").slideToggle("fast");
                });
            },
            error: function() {
                container.html("<p style='color:red;'>Gagal mengambil data jadwal dari server.</p>");
            }
        });
    }
    muatDataJadwal();

    // 4. Slider Berita Animasi
    let currentSlide = 0;
    const slideCount = $(".slide").length;
    
    $("#btn-next").click(function() {
        if(currentSlide < slideCount - 1) {
            currentSlide++;
            $("#berita-slider").css("margin-left", `-${currentSlide * 100}%`);
        }
    });
    $("#btn-prev").click(function() {
        if(currentSlide > 0) {
            currentSlide--;
            $("#berita-slider").css("margin-left", `-${currentSlide * 100}%`);
        }
    });

    // 5. Animasi Progress Bar untuk Voting
    $(".vote-btn").click(function() {
        let targetBar = $(this).data("target"); 
        let targetValue = $(this).data("val"); 
        
        $(targetBar).animate({ width: targetValue }, 1000); 
        $(this).prop("disabled", true).text("Voted").css("background", "#ccc");
    });

});