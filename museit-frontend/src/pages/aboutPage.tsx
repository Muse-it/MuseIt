export default function AboutPage() {
  return (
    <div class="p-8">
      <div class="mt-6 flex">
        <div class="mr-3">
          <h1 class="text-3xl font-bold">About MuseIt</h1>

          <p class="mt-4">A tool to explore and visualise online music data.</p>

          <h3 class="mt-12 text-2xl font-bold">Instructions to download</h3>
          <p class="mt-2">
            When a plot opens, plotly generated plots will have a download
            button in the top-right to download as png (camera icon)
          </p>
          <p class="mt-3">{"For generated images, right-click -> Save as"}</p>
        </div>

        <img
          class="rounded-md w-2/3 mt-3"
          src="/about.jpg"
          alt="MuseIt Diagram"
        />
      </div>
    </div>
  );
}
