// app/sohojogi/page.tsx

'use client'

import { useState } from "react"

export default function SohojogiPage() {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    area: "",
    helpType: ""
  })

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    alert("ধন্যবাদ! আপনার তথ্য গ্রহণ করা হয়েছে।")
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-6">

      <h1 className="text-4xl font-bold text-center mb-4">
        সহযোগী হোন
      </h1>

      <p className="text-center text-gray-600 mb-10">
        খালেদ সাইফুল্লাহ জুয়েলের উন্নয়নমূলক কার্যক্রমে অংশ নিতে আপনার তথ্য দিন।
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 space-y-6"
      >

        <div>
          <label className="block mb-2 font-medium">
            আপনার নাম
          </label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            মোবাইল নাম্বার
          </label>
          <input
            type="text"
            name="phone"
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            এলাকা
          </label>
          <input
            type="text"
            name="area"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            কীভাবে সহযোগিতা করতে চান
          </label>

          <select
            name="helpType"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          >
            <option>ক্যাম্পেইনে কাজ করতে চাই</option>
            <option>স্বেচ্ছাসেবক হতে চাই</option>
            <option>অর্থনৈতিক সহযোগিতা</option>
            <option>প্রচারণায় সহযোগিতা</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
        >
          তথ্য জমা দিন
        </button>

      </form>

    </div>
  )
}