export const NotFound = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 bg-background text-foreground">
        <h1 className="text-4xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">The page you are looking for does not exist.</p>
        <a href="/" className="cosmic-button">Back to home</a>
    </main>
  )
}

export default NotFound
