import React from 'react';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-[#f5f7f9] dark:bg-[#0d1419] border-t border-gray-200 dark:border-gray-800">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
					{/* Brand & Legal Info */}
					<div className="space-y-6">
						<div>
							<span className="text-2xl font-bold text-[#2d353b] dark:text-white block tracking-tight">
								POSEIDON<br />DIVING CHARTERS
							</span>
							<div className="mt-2 text-[#8c959f] dark:text-gray-500 text-xs uppercase tracking-wider">
								<p className="font-semibold text-[#2d353b] dark:text-gray-400">MLVDM Green Calm Sea, Lda</p>
								<p>License: RNAAT nº 749/2025</p>
							</div>
						</div>
						<p className="text-[#8c959f] dark:text-gray-400 text-sm leading-relaxed">
							Tailor-made diving experiences in Lagos, Portugal. Creating unforgettable moments at sea for selective people.
						</p>
					</div>

					{/* Navigation */}
					<div>
						<span className="font-bold text-[#2d353b] dark:text-white block mb-6 text-sm uppercase tracking-widest">Explore</span>
						<div className="space-y-3 flex flex-col">
							<Link to="/" className="text-[#8c959f] dark:text-gray-400 hover:text-[#03c4c9] transition-colors text-sm">Home</Link>
              <Link to="/experiences" className="text-[#8c959f] dark:text-gray-400 hover:text-[#03c4c9] transition-colors text-sm">Experiences</Link>
							<Link to="/beach-charter" className="text-[#8c959f] dark:text-gray-400 hover:text-[#03c4c9] transition-colors text-sm">Beach Charter</Link>
							<Link to="/about" className="text-[#8c959f] dark:text-gray-400 hover:text-[#03c4c9] transition-colors text-sm">About Us</Link>
							<Link to="/blog" className="text-[#8c959f] dark:text-gray-400 hover:text-[#03c4c9] transition-colors text-sm">Blog</Link>
              <Link to="/faq" className="text-[#8c959f] dark:text-gray-400 hover:text-[#03c4c9] transition-colors text-sm">FAQ</Link>
							<Link to="/contact" className="text-[#8c959f] dark:text-gray-400 hover:text-[#03c4c9] transition-colors text-sm">Contact</Link>
						</div>
					</div>

					{/* Contact */}
					<div>
						<span className="font-bold text-[#2d353b] dark:text-white block mb-6 text-sm uppercase tracking-widest">Contact</span>
						<div className="space-y-4">
							<a
								href="mailto:info@poseidondivingcharters.com"
								className="flex items-center text-[#8c959f] dark:text-gray-400 hover:text-[#03c4c9] transition-colors group"
							>
								<Mail size={16} className="mr-3 text-[#03c4c9] group-hover:text-[#f5c842] transition-colors" />
								<span className="text-sm">info@poseidondivingcharters.com</span>
							</a>
							<a
								href="tel:+351924955333"
								className="flex items-center text-[#8c959f] dark:text-gray-400 hover:text-[#03c4c9] transition-colors group"
							>
								<Phone size={16} className="mr-3 text-[#03c4c9] group-hover:text-[#f5c842] transition-colors" />
								<span className="text-sm">+351 924 955 333</span>
							</a>

							{/* UPDATED: Address is now a clickable Google Maps link */}
							<a
								href="https://maps.app.goo.gl/ytQaK5heC9wNRbJw5"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-start text-[#8c959f] dark:text-gray-400 hover:text-[#03c4c9] transition-colors group"
							>
								<MapPin size={16} className="mr-3 mt-1 flex-shrink-0 text-[#03c4c9] group-hover:text-[#f5c842] transition-colors" />
								<div className="text-sm">
									<p>Marina de Lagos, Portugal</p>
									<p className="mt-1 opacity-80 text-xs">Meeting point: Gate E - F - G - H - I</p>
								</div>
							</a>
						</div>
					</div>

					{/* Social */}
					<div>
						<span className="font-bold text-[#2d353b] dark:text-white block mb-6 text-sm uppercase tracking-widest">Social</span>
						<a
							href="https://www.instagram.com/poseidon.diving.charters/"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center text-[#8c959f] dark:text-gray-400 hover:text-[#03c4c9] transition-colors group"
						>
							<div className="bg-white dark:bg-[#162026] p-2 rounded-full shadow-sm group-hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800 mr-3">
								<Instagram size={20} className="text-[#2d353b] dark:text-white group-hover:text-[#03c4c9] transition-colors" />
							</div>
							<span className="text-sm">Follow on Instagram</span>
						</a>
					</div>
				</div>

				{/* Legal & Footer Bottom */}
				<div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
					<div className="flex flex-col md:flex-row justify-between items-center gap-6">
						<div className="flex items-center">
							<p className="text-[#8c959f] dark:text-gray-500 text-xs">
								© {currentYear} Poseidon Diving Charters. All rights reserved.
							</p>
							{/* Task 5: Hidden Admin Link */}
							<Link to="/admin-access" className="ml-2 text-[#8c959f] dark:text-gray-500 opacity-20 hover:opacity-100 transition-opacity" aria-label="Admin Access">•</Link>
						</div>

						<div className="flex flex-col md:items-end gap-3">
							<div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
								<Link to="/privacy" className="text-[#8c959f] dark:text-gray-500 text-xs hover:text-[#2d353b] hover:dark:text-white transition-colors">
									Privacy Policy
								</Link>
								<Link to="/terms" className="text-[#8c959f] dark:text-gray-500 text-xs hover:text-[#2d353b] hover:dark:text-white transition-colors">
									Terms of Service
								</Link>
								<Link to="/refund-policy" className="text-[#8c959f] dark:text-gray-500 text-xs hover:text-[#2d353b] hover:dark:text-white transition-colors">
									Refund Policy
								</Link>
								<Link to="/cookies" className="text-[#8c959f] dark:text-gray-500 text-xs hover:text-[#2d353b] hover:dark:text-white transition-colors">
									Cookie Policy
								</Link>
							</div>
							<div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
								<a
									href="https://www.consumoalgarve.pt/index.php/pt/"
									target="_blank"
									rel="noopener noreferrer"
									className="text-[#8c959f] dark:text-gray-500 text-[10px] uppercase tracking-tight hover:text-[#2d353b] hover:dark:text-white transition-colors"
								>
									Disputes (RAL)
								</a>
								<a
									href="https://www.livroreclamacoes.pt/Inicio/"
									target="_blank"
									rel="noopener noreferrer"
									className="text-[#8c959f] dark:text-gray-500 text-[10px] uppercase tracking-tight hover:text-[#2d353b] hover:dark:text-white transition-colors"
								>
									Livro de Reclamações
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;