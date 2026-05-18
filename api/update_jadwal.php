<?php
include 'koneksi.php';
$id = $_POST['id'];
$lawan = $_POST['lawan'];
$tanggal = $_POST['tanggal'];
$status = $_POST['status'];
$skor = $_POST['skor'];

$stmt = $conn->prepare("UPDATE jadwal SET lawan=?, tanggal=?, status=?, skor=? WHERE id=?");
$stmt->bind_param("ssssi", $lawan, $tanggal, $status, $skor, $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "sukses", "pesan" => "Jadwal berhasil diperbarui!"]);
} else {
    echo json_encode(["status" => "error", "pesan" => "Error: " . $stmt->error]);
}
$stmt->close(); $conn->close();
?>