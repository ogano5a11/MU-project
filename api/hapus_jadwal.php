<?php
include 'koneksi.php';
$id = $_POST['id'];
$stmt = $conn->prepare("DELETE FROM jadwal WHERE id=?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "sukses", "pesan" => "Jadwal berhasil dihapus!"]);
} else {
    echo json_encode(["status" => "error", "pesan" => "Error: " . $stmt->error]);
}
$stmt->close(); $conn->close();
?>