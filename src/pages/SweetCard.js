import { api } from '../services/api';

const SweetCard = ({ sweet, fetchSweets }) => {
  const handlePurchase = async () => {
    try {
      await api.post(`/sweets/${sweet._id}/purchase`);
      fetchSweets();
      alert('Purchased successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="card mb-3">
      {sweet.image && (
        <img src={`http://localhost:5000${sweet.image}`} className="card-img-top" alt={sweet.name} />
      )}
      <div className="card-body">
        <h5 className="card-title">{sweet.name}</h5>
        <p className="card-text">Price: ${sweet.price}</p>
        <p className="card-text">Location: {sweet.location}</p>
        <button className="btn btn-primary" onClick={handlePurchase} disabled={sweet.quantity <= 0}>
          Purchase
        </button>
      </div>
    </div>
  );
};


export default SweetCard;
