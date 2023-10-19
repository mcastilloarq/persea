

export default function Home() {
  const makeCall = () => {
    fetch('/api/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'John Doe' }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data)
      })
      .catch((error) => {
        console.error('Error:', error)
      }
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <input type="button" value="Click Me" onClick={makeCall} />
    </main>
  )
}
