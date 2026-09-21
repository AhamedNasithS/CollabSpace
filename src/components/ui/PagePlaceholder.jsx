function PagePlaceholder({ title, description }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-heading">
        {title}
      </h1>

      {description && (
        <p className="mt-2 text-sm text-muted">
          {description}
        </p>
      )}
    </div>
  );
}

export default PagePlaceholder;