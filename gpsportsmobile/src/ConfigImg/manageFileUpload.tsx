import { firebaseConfig } from '../../firebase-config';
import { getFirestore, collection, getDocs, updateDoc, doc, where, query } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const manageFileUpload = async (
  fileBlob,
  { onStart, onProgress, onComplete, onFail }
) => {
  const imgName = "img-" + new Date().getTime();

  const storage = getStorage(firebaseConfig);
  const storageRef = ref(storage, `images/${imgName}.jpg`);

  console.log("Uploading file", imgName);

  // Definir metadados do arquivo
  const metadata = {
    contentType: "image/jpeg",
  };

  // Disparar evento de início de upload de arquivo
  onStart && onStart();

  const uploadTask = uploadBytesResumable(storageRef, fileBlob, metadata);

  // Monitorar progresso do upload
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      // Atualizar progresso do upload
      onProgress && onProgress(progress.toFixed(2));
    },
    (error) => {
      // Lidar com erros
      onFail && onFail(error);
    },
    () => {
      // Upload concluído com sucesso, obter URL de download
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        // Disparar evento de conclusão
        onComplete && onComplete(downloadURL);

        console.log("Arquivo disponível em", downloadURL);
      });
    }
  );
};

export default manageFileUpload;
