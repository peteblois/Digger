namespace Digger
{
	using System;
	using System.Windows;

	public class Application : System.Windows.Application
	{
		public Application()
		{
			this.Startup += this.Application_Startup;
		}

		private void Application_Startup(object sender, StartupEventArgs args)
		{
			this.RootVisual = new ApplicationWindow();
		}
	}
}
