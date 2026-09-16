import React from 'react'
import { Link } from 'react-router-dom'
// import { Instagram, Twitter, Facebook } from 'lucide-react'

export default function Footer () {
    return(
      <footer className="w-full pt-12 pb-4 text-gray-400 text-sm mt-8">
        <div className="border-t border-gray-700 mb-8"></div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            <div className="space-y-3">
                <h3 className="font-bold text-white mb-4">Company</h3>
                <button className="block text-left hover:text-white">About</button>
                <button className="block text-left hover:text-white">Jobs</button>
                <button className="block text-left hover:text-white">For the Record</button>
            </div>
            <div className="space-y-3">
                <h3 className="font-bold text-white mb-4">Communities</h3>
                <button className="block text-left hover:text-white">For Artists</button>
                <button className="block text-left hover:text-white">Developers</button>
                <button className="block text-left hover:text-white">Investors</button>
                <button className="block text-left hover:text-white">Vendors</button>
            </div>
            <div className="space-y-3">
                <h3 className="font-bold text-white mb-4">Useful links</h3>
                <button className="block text-left hover:text-white">Support</button>
                <Link to="/feedback" className="block text-left hover:text-white">Feedback</Link>
                <Link to="/feedback" className="block text-left hover:text-white">Free Mobile App</Link>
            </div>
            <div className="space-y-3 col-span-2 md:col-span-1">
                <h3 className="font-bold text-white mb-4">Autumn Plans</h3>
                <button className="block text-left hover:text-white">Autumn Individual</button>
                <button className="block text-left hover:text-white">Autumn Family</button>
                <button className="block text-left hover:text-white">Autumn Student</button>
                <button className="block text-left hover:text-white">Autumn Free</button>
            </div>
            {/* <div className="col-span-2 md:col-span-1 flex md:justify-end items-start gap-4">
                <a href="/" className="bg-[#1f1f1f] p-3 rounded-full hover:bg-[#282828]"><Instagram size={20} className="text-white" /></a>
                <a href="/" className="bg-[#1f1f1f] p-3 rounded-full hover:bg-[#282828]"><Twitter size={20} className="text-white" /></a>
                <a href="/" className="bg-[#1f1f1f] p-3 rounded-full hover:bg-[#282828]"><Facebook size={20} className="text-white" /></a>
            </div> */}
        </div>
        <div className="border-t border-gray-700 pt-6 grid grid-cols-1 md:grid-cols-3 gap-y-4 items-start text-xs">
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <button className="hover:text-white">Legal</button>
                <button className="hover:text-white">Safety & Privacy Center</button>
                <button className="hover:text-white">Privacy Policy</button>
                <button className="hover:text-white">Cookies</button>
                <button className="hover:text-white">Accessibility</button>
            </div>
            <div className="flex flex-col items-center mt-6 md:mt-4">
                <span>© 2026 Autumn</span>
                <span>Created by Naman</span>
            </div>
            <div></div>
        </div>
      </footer>
    )
};