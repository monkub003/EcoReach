export default function Login() {
    async function onLogin(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const response = await fetch('http://127.0.0.1:3342/api/token/', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            alert("Your username/password are incorrect!");
            return;
        }

        try {
            const data = await response.json();
            console.log("Login response:", data); // Debug output

            if (!data.access || !data.refresh) {
                alert("Token response is incomplete.");
                return;
            }

            localStorage.setItem('jwt_access', data.access);
            localStorage.setItem('jwt_refresh', data.refresh);

            alert("Login success!");
            window.location.href = "/info/me"; // redirect to profile
        } catch (error) {
            console.error("Login error:", error);
            alert("Something went wrong during login.");
        }
    }

    return (
        <main className='flex min-h-screen flex-col items-center justify-between'>
            <div
                style={{ fontSize: "64px" }}
                className="w-full flex flex-col justify-center items-center dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
            >
                <div>CN334 Login form</div>
                <form onSubmit={onLogin} className="flex flex-col gap-1 text-3xl">
                    <div>
                        <label>username : </label>
                        <input name="username" className="p-1 rounded-lg text-black" type="text" placeholder="cn334" />
                    </div>
                    <div>
                        <label>Password : </label>
                        <input name="password" className="p-1 rounded-lg text-black" type="password" placeholder="password" />
                    </div>
                    <button className="p-2 bg-green-400 rounded-xl my-2" type="submit">
                        Login
                    </button>
                </form>
            </div>
        </main>
    );
}
