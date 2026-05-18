<?php
include 'koneksi.php';
$lawan = $_POST['lawan'];
$tanggal = $_POST['tanggal'];
$status = $_POST['status'];
$skor = $_POST['skor'];

$stmt = $conn->prepare("INSERT INTO jadwal (lawan, tanggal, status, skor) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $lawan, $tanggal, $status, $skor);

if ($stmt->execute()) {
    echo json_encode(["status" => "sukses", "pesan" => "Jadwal berhasil disimpan!"]);
} else {
    echo json_encode(["status" => "error", "pesan" => "Error: " . $stmt->error]);
}
$stmt->close(); $conn->close();
?>