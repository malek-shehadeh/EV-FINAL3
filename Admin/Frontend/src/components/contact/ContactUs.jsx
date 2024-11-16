/////////////////////////////////////////////

import React, { useState, useEffect } from "react";
import { Mail, Search, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

const ContactMessages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage] = useState(10);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/contact/contact-messages"
      );
      setMessages(response.data);
      setFilteredMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = messages.filter(
      (message) =>
        message.name.toLowerCase().includes(term) ||
        message.email.toLowerCase().includes(term) ||
        message.subject.toLowerCase().includes(term)
    );
    setFilteredMessages(filtered);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleReply = (email, subject) => {
    setSelectedEmail(email);
    setSelectedSubject(subject);
    setIsReplyDialogOpen(true);
  };

  const handleSendReply = async () => {
    try {
      await axios.post("http://localhost:4000/api/contact/send-email", {
        email: selectedEmail,
        subject: selectedSubject,
        message: replyMessage,
      });
      alert("Reply sent successfully!");
      setIsReplyDialogOpen(false);
      setReplyMessage("");
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/contact/contact-messages/${id}`
      );
      fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message. Please try again.");
    }
  };

  // Pagination logic
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(
    indexOfFirstMessage,
    indexOfLastMessage
  );
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 sm:p-6 border border-gray-700 mb-8">
      {/* Responsive header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-100">
          Contact Messages
        </h2>
        <div className="relative w-full sm:w-auto min-w-[200px] sm:min-w-[300px]">
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Message
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {currentMessages.map((message) => (
              <tr key={message._id}>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {message.name}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {message.email}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {message.subject}
                </td>
                <td className="px-4 sm:px-6 py-4 text-sm text-gray-300">
                  {message.message}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    onClick={() => handleReply(message.email, message.subject)}
                    className="text-blue-400 hover:text-blue-300 mr-2"
                  >
                    <Mail size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(message._id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <div className="text-sm text-gray-400 order-2 sm:order-1">
          Showing {indexOfFirstMessage + 1} to{" "}
          {Math.min(indexOfLastMessage, filteredMessages.length)} of{" "}
          {filteredMessages.length} messages
        </div>
        <div className="flex items-center space-x-2 order-1 sm:order-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-md ${
              currentPage === 1
                ? "text-gray-500 cursor-not-allowed"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-gray-300 min-w-[100px] text-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-md ${
              currentPage === totalPages
                ? "text-gray-500 cursor-not-allowed"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Reply Dialog */}
      {isReplyDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Reply to Message
            </h2>
            <textarea
              className="w-full bg-gray-700 text-white rounded-lg p-2 mb-4"
              placeholder="Type your reply here..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={5}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                onClick={() => setIsReplyDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                onClick={handleSendReply}
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
