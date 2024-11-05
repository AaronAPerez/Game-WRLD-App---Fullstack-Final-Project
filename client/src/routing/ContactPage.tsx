

const ContactPage = () => {
  return (
<>
    <div>

        <form onSubmit={(e) => {
            e.preventDefault();

        }}>
            

            <button className="btn btn-primary">Submit</button>
        </form>
    </div>
</>
  )
}

export default ContactPage