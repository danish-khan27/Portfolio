import './ProfileCard.css';

export default function ProfileCard({ name, role, image, children }) {
  return (
    <div className="profile-card">
      {image && (
        <div className="profile-card-image">
          <img src={image} alt={name} />
        </div>
      )}
      <div className="profile-card-body">
        <h3>{name}</h3>
        {role && <p className="profile-card-role">{role}</p>}
        {children}
      </div>
    </div>
  );
}
