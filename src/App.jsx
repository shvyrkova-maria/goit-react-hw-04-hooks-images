import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Searchbar from 'components/Searchbar/Searchbar';
import Spinner from 'components/Spinner/Spinner';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import Button from 'components/Button/Button';
import Notification from 'components/Notification/Notification';
import Modal from 'components/Modal/Modal';
import fetchImages from 'services/pixabayApi';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [status, setStatus] = useState(Status.IDLE);
  const [reqError, setReqError] = useState(null);

  useEffect(() => {
    if (!searchQuery) return;
    setStatus(Status.PENDING);
    fetchImagesOnClick(searchQuery, page);
  }, [page, searchQuery]);

  const fetchImagesOnClick = (searchQuery, page) => {
    fetchImages(searchQuery, page)
      .then(({ hits }) => {
        if (hits.length === 0) {
          setStatus(Status.IDLE);
          toast.error("Sorry, we couldn't find any matches");
        } else {
          setImages(images => [...images, ...hits]);
          setStatus(Status.RESOLVED);

          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
          });
        }
      })
      .catch(error => {
        setReqError(Status.REJECTED);
      });
  };

  const handleSubmitForm = value => {
    setSearchQuery(value);
    setPage(1);
    setImages([]);
  };

  const handleButtonClick = () => setPage(page => page + 1);

  const handleImageClick = activeImage => setActiveImage(activeImage);
  const resetActiveImage = () => setActiveImage(null);

  return (
    <>
      <Searchbar onSubmit={handleSubmitForm} toast={toast} />
      {status === Status.IDLE && <></>}
      {status === Status.PENDING && <Spinner />}
      {status === Status.REJECTED && <Notification text={reqError} />}
      {status === Status.RESOLVED && (
        <>
          <ImageGallery images={images} onImageClick={handleImageClick} />
          <Button onClick={handleButtonClick} />
          {activeImage && (
            <Modal closeModal={resetActiveImage}>
              <img src={activeImage.largeImageURL} alt={activeImage.tags} />
            </Modal>
          )}
        </>
      )}
      <Toaster
        position="top-right"
        containerStyle={{ top: 100 }}
        toastOptions={{
          style: {
            border: '1px solid #3f51b5',
            padding: '12px',
            color: '#212121',
          },
        }}
      />
    </>
  );
}

export default App;
